/* @flow */
'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const pkg = require('../package.json')
const _ = require('lodash')
const Cache = require('koop-cache-memory')
const Logger = require('@koopjs/logger')
const routes = require('./routes')
const Controller = require('./controllers')
const Model = require('./models')
const DatasetController = require('./controllers/dataset')
const Dataset = require('./models/dataset')
const helpers = require('./helpers')
const middleware = require('./middleware')
const Events = require('events')
const Util = require('util')
const path = require('path')
const geoservices = require('koop-output-geoservices')
const LocalFS = require('koop-localfs')

function Koop (config) {
  this.version = pkg.version
  this.server = initServer()
  this.config = require('config')
  // default to LocalDB cache
  // cache registration overrides this
  this.cache = new Cache()
  this.log = new Logger(config)
  this.pluginRoutes = []
  this.register(geoservices)
  this.register(LocalFS)
  this.controllers = {}

  const dataset = new Dataset(this)
  const datasetController = new DatasetController(dataset)
  bindRouteSet(routes, datasetController, this.server)

  const fsRoutes = routes.concat(geoservices.routes.map(route => {
    return {
      path: `/datasets/:id/${route.path}`,
      handler: route.handler,
      methods: route.methods
    }
  }))

  bindRouteSet(fsRoutes, datasetController, this.server)

  this.status = {
    version: this.version,
    providers: {}
  }

  this.server
    .on('mount', () => {
      this.log.info(`Koop ${this.version} mounted at ${this.server.mountpath}`)
    })
    .get('/status', (req, res) => res.json(this.status))
}

Util.inherits(Koop, Events)

/**
 * express middleware setup
 */
function initServer () {
  return express()
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
  // If an authentication module has been registered, apply it to the provider's Model
  if (this._auth_module) {
    provider.Model.prototype.authenticationSpecification = Object.assign({}, this._auth_module.authenticationSpecification(provider.name), { provider: provider.name })
    provider.Model.prototype.authenticate = this._auth_module.authenticate
    provider.Model.prototype.authorize = this._auth_module.authorize
  }

  // Need a new copy of Model otherwise providers will step on each other
  const model = this._initProviderModel(provider)
  // controller is optional
  let controller
  if (provider.Controller) {
    Util.inherits(provider.Controller, Controller)
    controller = new provider.Controller(model)
  } else {
    controller = new Controller(model)
  }
  const name = provider.name || provider.plugin_name
  this.controllers[name] = controller
  provider.version = provider.version || '(version missing)'

  // if a provider has a status object store it
  // TODO: deprecate & serve more meaningful status reports dynamically.
  if (provider.status) {
    this.status.providers[name] = provider.status
    provider.version = provider.status.version
  }

  // add each route, the routes let us override defaults etc.
  bindRoutes(provider, controller, this.server, this.pluginRoutes, options)

  this.log.info('registered provider:', name, provider.version)
}

Koop.prototype._initProviderModel = function (provider) {
  function ThisModel (options) {
    this.cache = options.cache
    ThisModel.super_.call(this, options)
  }

  extend(ThisModel, Model)
  Util.inherits(ThisModel, provider.Model)

  return new ThisModel(this)
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

  this.pluginRoutes = this.pluginRoutes.concat(Output.routes)
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
function bindRoutes (provider, controller, server, pluginRoutes, options) {
  bindPluginOverrides(provider, controller, server, pluginRoutes, options)
  bindRouteSet(provider.routes, controller, server, options)
}

function bindPluginOverrides (provider, controller, server, pluginRoutes, options = {}) {
  const name = provider.namespace || provider.plugin_name || provider.name
  const namespace = name.replace(/\s/g, '').toLowerCase()
  pluginRoutes.forEach(route => {
    let fullRoute = helpers.composeRouteString(route.path, namespace, {
      hosts: provider.hosts,
      disableIdParam: provider.disableIdParam,
      absolutePath: route.absolutePath,
      routePrefix: options.routePrefix
    })
    route.methods.forEach(method => {
      try {
        console.log(`provider=${provider.name} fullRoute:${fullRoute} ${method.toUpperCase()}`)
        server[method](fullRoute, controller[route.handler].bind(controller))
      } catch (e) {
        console.error(`error=controller does not contain specified method method=${method.toUpperCase()} path=${fullRoute} handler=${route.handler}`)
        process.exit(1)
      }
    })
  })
}

function bindRouteSet (routes = [], controller, server, options = {}) {
  const { routePrefix = '' } = options
  routes.forEach(route => {
    const routePath = path.posix.join(routePrefix, route.path)
    route.methods.forEach(method => {
      try {
        server[method](routePath, controller[route.handler].bind(controller))
      } catch (e) {
        console.error(`error=controller does not contain specified method method=${method.toUpperCase()} path=${routePath} handler=${route.handler}`)
        process.exit(1)
      }
    })
  })
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
  this.log.info('registered filesystem:', Filesystem.plugin_name, Filesystem.version)
}

/**
 * registers a plugin
 * Plugins can be any function that you want to have global access to
 * within koop provider models
 *
 * @param {object} any koop plugin
 */
Koop.prototype._registerPlugin = function (Plugin) {
  const name = Plugin.name || Plugin.plugin_name
  if (!name) throw new Error('Plugin is missing name')
  let dependencies
  if (typeof Plugin.dependencies && Plugin.dependencies.length) {
    dependencies = Plugin.dependencies.reduce((deps, dep) => {
      deps[dep] = this[dep]
      return deps
    }, {})
  }
  this[name] = new Plugin(dependencies)
  this.log.info('registered plugin:', name, Plugin.version)
}

module.exports = Koop
