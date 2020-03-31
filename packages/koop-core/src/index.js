/* @flow */
'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const pkg = require('../package.json')
const _ = require('lodash')
const Joi = require('@hapi/joi')
const Cache = require('koop-cache-memory')
const Logger = require('@koopjs/logger')
const datasetRoutes = require('./routes-datasets')
const Controller = require('./controllers')
const ExtendedModel = require('./models/extended-model')
const DatasetController = require('./controllers/dataset')
const {
  registerDatasetProvider,
  registerProviderRoutes,
  registerPluginRoutes,
  consolePrinting,
  bindAuthMethods
} = require('./helpers')
const middleware = require('./middleware')
const Events = require('events')
const Util = require('util')
const path = require('path')
const geoservices = require('koop-output-geoservices')
const LocalFS = require('koop-localfs')

const providerOptionsSchema = Joi.object({
  cache: Joi.object().keys({
    retrieve: Joi.function().arity(3).required(),
    upsert: Joi.function().arity(3).required()
  }).unknown(true).optional(),
  routePrefix: Joi.string().optional(),
  before: Joi.function().arity(2).optional(),
  after: Joi.function().arity(3).optional(),
  name: Joi.string().optional(),
  defaultToOutputRoutes: Joi.boolean().optional()
}).unknown(true)

function Koop (config) {
  this.version = pkg.version
  this.config = config || require('config')
  this.server = initServer(this.config)

  // default to LocalDB cache
  // cache registration overrides this
  this.cache = new Cache()
  this.log = new Logger(this.config)
  this.pluginRoutes = []
  this.register(geoservices)
  this.register(LocalFS)
  this.controllers = {}
  this.status = {
    version: this.version,
    providers: {}
  }

  this.server
    .on('mount', () => {
      this.log.info(`Koop ${this.version} mounted at ${this.server.mountpath}`)
    })
    .get('/status', (req, res) => res.json(this.status))

  registerDatasetProvider({ koop: this, routes: datasetRoutes })
}

Util.inherits(Koop, Events)

/**
 * express middleware setup
 */
function initServer (config) {
  const app = express()
  // parse application/json
    .use(bodyParser.json({ limit: '10000kb' }))
    // parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))
    .disable('x-powered-by')
    // TODO this should just live inside featureserver
    .use((req, res, next) => {
    // request parameters can come from query url or POST body
      req.query = _.extend(req.query || {}, req.body || {})
      next()
    })
    .use(middleware.paramTrim)
    .use(middleware.paramParse)
    .use(middleware.paramCoerce)
    // for demos and preview maps in providers
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, '/public')))
    .use(cors())

  // Use compression unless explicitly disable in the config
  if (!config.disableCompression) app.use(compression())
  return app
}

Koop.prototype.register = function (plugin, options) {
  if (typeof plugin === 'undefined') throw new Error('Plugin undefined.')
  switch (plugin.type) {
    case 'provider':
      return this._registerProvider(plugin, options)
    case 'cache':
      return this._registerCache(plugin, options)
    case 'plugin':
      return this._registerPlugin(plugin, options)
    case 'filesystem':
      return this._registerFilesystem(plugin, options)
    case 'output':
      return this._registerOutput(plugin, options)
    case 'auth':
      return this._registerAuth(plugin, options)
    default:
      this.log.warn('Unrecognized plugin type: "' + plugin.type + '". Defaulting to provider.')
      return this._registerProvider(plugin, options)
  }
}

/**
 * Store an Authentication plugin on the koop instance for use during provider registration.
 * @param {object} auth
 */
Koop.prototype._registerAuth = function (auth) {
  this._auth_module = auth
}

/**
 * registers a provider
 * exposes the provider's routes, controller, and model
 *
 * @param {object} provider - the provider to be registered
 */
Koop.prototype._registerProvider = function (provider, options = {}) {
  validateAgainstSchema(options, providerOptionsSchema, 'provider options')

  provider.namespace = getProviderName(provider, options)
  provider.version = provider.version || '(version missing)'

  // If an authentication module has been registered, apply it to the provider's Model
  if (this._auth_module) bindAuthMethods({ provider, auth: this._auth_module })

  // Need a new copy of Model otherwise providers will step on each other
  const model = new ExtendedModel({ ProviderModel: provider.Model, koop: this }, options)

  // controller is optional
  let controller
  if (provider.Controller) {
    Util.inherits(provider.Controller, Controller)
    controller = new provider.Controller(model)
  } else {
    controller = new Controller(model)
  }

  this.controllers[provider.namespace] = controller

  // if a provider has a status object store it
  // TODO: deprecate & serve more meaningful status reports dynamically.
  if (provider.status) {
    this.status.providers[provider.namespace] = provider.status
    provider.version = provider.status.version
  }

  const registeredRoutes = registerRoutes({
    provider,
    controller,
    server: this.server,
    pluginRoutes: this.pluginRoutes
  }, options)
  consolePrinting(provider.namespace, registeredRoutes)

  this.log.info('registered provider:', provider.namespace, provider.version)
}

/**
 * registers a provider
 * exposes the provider's routes, controller, and model
 *
 * @param {object} output - the output plugin to be registered
 */
Koop.prototype._registerOutput = function (Output) {
  extend(Controller, Output)
  extend(DatasetController, Output)
  const routes = Output.routes.map(function (route) {
    route.output = Output.name
    return route
  })
  this.pluginRoutes = this.pluginRoutes.concat(routes)
  this.log.info('registered output:', Output.name, Output.version)
}

function extend (klass, extender) {
  for (const p in extender.prototype) {
    klass.prototype[p] = extender.prototype[p]
  }
}

/**
 * binds each route from provider routes object to corresponding controller handler
 *
 * @param {object} provider - a registered koop provider
 * @param {object} controller - the initiated provider's controller
 * @param {object} server - the koop express server
 */
function registerRoutes ({ provider, controller, server, pluginRoutes }, options = {}) {
  // Plugin and provider-routes may conflict; which ever is registered first gets precendence; default is provider route precedence
  if (options.defaultToOutputRoutes) return registerPluginRoutesFirst({ provider, controller, server, pluginRoutes }, options)
  return registerProviderRoutesFirst({ provider, controller, server, pluginRoutes }, options)
}

function registerPluginRoutesFirst ({ provider, controller, server, pluginRoutes }, options = {}) {
  const pluginRouteMap = registerPluginRoutes({ provider, controller, server, pluginRoutes }, options)
  const providerRouteMap = registerProviderRoutes({ provider, controller, server }, options)
  return { providerRouteMap, pluginRouteMap }
}

function registerProviderRoutesFirst ({ provider, controller, server, pluginRoutes }, options = {}) {
  const providerRouteMap = registerProviderRoutes({ provider, controller, server }, options)
  const pluginRouteMap = registerPluginRoutes({ provider, controller, server, pluginRoutes }, options)
  return { providerRouteMap, pluginRouteMap }
}

/**
 * registers a cache
 * overwrites any existing koop.Cache.db
 *
 * @param {object} cache - a koop database adapter
 */
Koop.prototype._registerCache = function (Cache, options) {
  this.cache = new Cache(options)
  this.log.info('registered cache:', Cache.name, Cache.version)
}

/**
 * registers a filesystem
 * overwrites the default filesystem
 *
 * @param {object} filesystem - a koop filesystem adapter
 */
Koop.prototype._registerFilesystem = function (Filesystem) {
  this.fs = new Filesystem()
  this.log.info('registered filesystem:', Filesystem.pluginName || Filesystem.plugin_name || Filesystem.name, Filesystem.version)
}

/**
 * registers a plugin
 * Plugins can be any function that you want to have global access to
 * within koop provider models
 *
 * @param {object} any koop plugin
 */
Koop.prototype._registerPlugin = function (Plugin) {
  const name = Plugin.pluginName || Plugin.plugin_name || Plugin.name
  if (!name) throw new Error('Plugin is missing name')
  let dependencies
  if (Array.isArray(Plugin.dependencies) && Plugin.dependencies.length) {
    dependencies = Plugin.dependencies.reduce((deps, dep) => {
      deps[dep] = this[dep]
      return deps
    }, {})
  }
  this[name] = new Plugin(dependencies)
  this.log.info('registered plugin:', name, Plugin.version)
}

function validateAgainstSchema (params, schema, prefix) {
  const result = schema.validate(params)
  if (result.error) throw new Error(`${prefix} ${result.error}`)
}

function getProviderName (provider, options) {
  return options.name || provider.namespace || provider.pluginName || provider.plugin_name || provider.name
}

module.exports = Koop
