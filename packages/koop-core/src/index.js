/* @flow */
'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
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
const chalk = require('chalk')
const Table = require('easy-table')

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

  const dataset = new Dataset(this)
  const datasetController = new DatasetController(dataset)
  bindRoutes({ name: 'datasets', routes }, datasetController, this.server, this.pluginRoutes)

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
  const name = provider.pluginName || provider.plugin_name || provider.name
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
function bindRoutes (provider, controller, server, pluginRoutes, options) {
  // Provider-routes are bound first; any routing conflicts will result in requests routed to provider
  bindProviderRoutes(provider, controller, server, options)
  bindPluginRoutes(provider, controller, server, pluginRoutes, options)
}

/**
 * Print provider routes to terminal
 * @param {string} providerName
 * @param {object[]} providerRoutes
 */
function printProviderRoutes (providerName, providerRoutes) {
  // Print provider routes
  const table = new Table()
  Object.keys(providerRoutes).forEach((key) => {
    table.cell(chalk.cyan(`"${providerName}" provider routes`), chalk.yellow(key))
    table.cell(chalk.cyan('Methods'), chalk.green(providerRoutes[key].join(', ').toUpperCase()))
    table.newRow()
  })
  console.log(`\n${table.toString()}`)
}

/**
 * Print provider plugin routes to terminal
 * @param {string} providerName
 * @param {object} pluginRouteMap
 */
function printPluginRoutes (providerName, pluginRouteMap) {
  // Print output plugin routes
  Object.keys(pluginRouteMap).forEach(key => {
    const table = new Table()
    Object.keys(pluginRouteMap[key]).forEach(routeKey => {
      table.cell(chalk.cyan(`"${key}" output routes for the "${providerName}" provider`), chalk.yellow(routeKey))
      table.cell(chalk.cyan('Methods'), chalk.green(pluginRouteMap[key][routeKey].join(', ').toUpperCase()))
      table.newRow()
    })
    console.log(`\n${table.toString()}`)
  })
}

function bindPluginRoutes (provider, controller, server, pluginRoutes, options = {}) {
  const name = provider.namespace || provider.pluginName || provider.plugin_name || provider.name
  const namespace = name.replace(/\s/g, '').toLowerCase()
  const pluginRouteMap = {}

  pluginRoutes.forEach(route => {
    // Compose the full route string from its components
    const fullRoute = helpers.composeRouteString(route.path, namespace, {
      hosts: provider.hosts,
      disableIdParam: provider.disableIdParam,
      absolutePath: route.absolutePath,
      routePrefix: options.routePrefix
    })

    // For each output plugin, keep track of routes, methods
    pluginRouteMap[route.output] = pluginRouteMap[route.output] || {}
    pluginRouteMap[route.output][fullRoute] = pluginRouteMap[route.output][fullRoute] || []

    // Bind the controller to each route
    route.methods.forEach(method => {
      try {
        server[method](fullRoute, controller[route.handler].bind(controller))
        // Add method to this route's method array
        pluginRouteMap[route.output][fullRoute].push(method)
      } catch (e) {
        console.error(`error=controller does not contain specified method method=${method.toUpperCase()} path=${fullRoute} handler=${route.handler}`)
        process.exit(1)
      }
    })
  })
  // Print plugin routes to console
  if (process.env.NODE_ENV !== 'test') printPluginRoutes(name, pluginRouteMap)
}

function bindProviderRoutes (provider, controller, server, options = {}) {
  const { routePrefix = '' } = options
  const { routes = [] } = provider
  const providerRoutes = {}

  routes.forEach(route => {
    const routePath = path.posix.join(routePrefix, route.path)

    // Keep track of routes, methods
    providerRoutes[routePath] = providerRoutes[routePath] || []

    route.methods.forEach(method => {
      try {
        server[method](routePath, controller[route.handler].bind(controller))
        // Add method to this route's method array
        providerRoutes[routePath].push(method)
      } catch (e) {
        console.log(e)
        console.error(`error=controller does not contain specified method method=${method.toUpperCase()} path=${routePath} handler=${route.handler}`)
        process.exit(1)
      }
    })
  })

  // Print provider routes to terminal
  if (process.env.NODE_ENV !== 'test') {
    const name = provider.namespace || provider.pluginName || provider.plugin_name || provider.name
    printProviderRoutes(name, providerRoutes)
  }
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

module.exports = Koop
