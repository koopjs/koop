/* @flow */
'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const pkg = require('../package.json')
const _ = require('lodash')
const Cache = require('./cache')
const LocalDb = require('./local')
const Logger = require('koop-logger')
const BaseController = require('./controller')
const Events = require('events')
const Util = require('util')
const path = require('path')
const FeatureServer = require('koop-featureserver-plugin')
const LocalFS = require('koop-localfs')

function Koop (config) {
  this.version = pkg.version
  this.server = initServer()
  this.config = require('config')
  // default to LocalDB cache
  // cache registration overrides this
  this.cache = initDefaultCache()
  this.log = new Logger(config)
  this.pluginRoutes = []
  this.register(FeatureServer)
  this.register(LocalFS)
  this.controllers = {}
  // TODO: consolidate status, services, `/providers` routes
  this.status = {
    version: this.version,
    providers: {}
  }

  this.server.get('/status', (req, res) => res.json(this.status))

  this.server.on('mount', () => {
    // put this on a handler
    if (!this.config.db || !this.config.db.conn) {
      this.log.warn('No cache configured, defaulting to local in-memory cache. No data will be cached across server sessions.')
    }
    this.log.info(`Koop ${this.version} mounted at ${this.server.mountpath}`)
  })
}

Util.inherits(Koop, Events)

function initDefaultCache () {
  const cache = new Cache()
  cache.db = LocalDb
  return cache
}

Koop.Controller = require('./controller')

/**
 * express middleware setup
 */
function initServer () {
  return express()
  // parse application/json
  .use(bodyParser.json({limit: '10000kb'}))
  // parse application/x-www-form-urlencoded
  .use(bodyParser.urlencoded({ extended: false }))
  .disable('X-Powered-By')
  // TODO this should just live inside featureserver
  .use((req, res, next) => {
    // request parameters can come from query url or POST body
    req.query = _.extend(req.query || {}, req.body || {})
    next()
  })
  // for demos and preview maps in providers
  .set('view engine', 'ejs')
  .use(express.static(__dirname + '/public'))
  .use(cors())
}

Koop.prototype.register = function (plugin) {
  if (typeof plugin === 'undefined') throw new Error('Plugin undefined.')
  switch (plugin.type) {
    case 'provider':
      return this._registerProvider(plugin)
    case 'cache':
      return this._registerCache(plugin)
    case 'plugin':
      return this._registerPlugin(plugin)
    case 'filesystem':
      return this._registerFilesystem(plugin)
    case 'output':
      return this._registerOutput(plugin)
    default:
      this.log.warn('Unrecognized plugin type: "' + plugin.type + '". Defaulting to provider.')
      return this._registerProvider(plugin)
  }
}

/**
 * registers a provider
 * exposes the provider's routes, controller, and model
 *
 * @param {object} provider - the provider to be registered
 */
Koop.prototype._registerProvider = function (provider) {
  const model = new provider.Model(this)
  // controller is optional
  let controller
  if (provider.Controller) {
    Util.inherits(provider.Controller, BaseController)
    controller = new provider.Controller(model)
  } else {
    controller = new BaseController(model)
  }
  this.controllers[provider.plugin_name] = controller
  provider.version = provider.version || '(version missing)'

  // if a provider has a status object store it
  // TODO: deprecate & serve more meaningful status reports dynamically.
  if (provider.status) {
    this.status.providers[provider.plugin_name] = provider.status
    provider.version = provider.status.version
  }

  // add each route, the routes let us override defaults etc.
  bindRoutes(provider, controller, this.server, this.pluginRoutes)

  this.log.info('registered provider:', provider.plugin_name, provider.version)
}

/**
 * registers a provider
 * exposes the provider's routes, controller, and model
 *
 * @param {object} output - the output plugin to be registered
 */
Koop.prototype._registerOutput = function (Output) {
  Util.inherits(BaseController, Output)
  this.pluginRoutes = this.pluginRoutes.concat(Output.routes)
  this.log.info('registered output:', Output.plugin_name, Output.version)
}

/**
 * binds each route from provider routes object to corresponding controller handler
 *
 * @param {object} provider - a registered koop provider
 * @param {object} controller - the initiated provider's controller
 * @param {object} server - the koop express server
 */
function bindRoutes (provider, controller, server, pluginRoutes) {
  bindPluginOverrides(provider, controller, server, pluginRoutes)
  bindProviderOverrides(provider, controller, server)
}

function bindPluginOverrides (provider, controller, server, pluginRoutes) {
  const name = provider.namespace || provider.plugin_name || provider.name
  const namespace = name.replace(/\s/g, '').toLowerCase()
  pluginRoutes.forEach(route => {
    let fullRoute
    if (provider.hosts) {
      fullRoute = path.join('/', namespace, ':host', ':id', route.path)
    } else {
      fullRoute = path.join('/', namespace, ':id', route.path)
    }
    route.methods.forEach(method => {
      server[method](fullRoute, controller[route.handler].bind(controller))
    })
  })
}

function bindProviderOverrides (provider, controller, server) {
  provider.routes.forEach(route => {
    route.methods.forEach(method => {
      server[method](route.path, controller[route.handler])
    })
  })
}

/**
 * registers a cache
 * overwrites any existing koop.Cache.db
 *
 * @param {object} cache - a koop database adapter
 */
Koop.prototype._registerCache = function (cache) {
  if (!this.config.db || !this.config.db.conn) throw new Error('Cannot register cache: missing config.db.conn.')
  this.cache.db = cache.connect(this.config.db.conn, { log: this.log })
  this.log.info('registered cache:', cache.plugin_name, cache.version)
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
  if (!Plugin.plugin_name) throw new Error('Plugin is missing name')
  let dependencies
  if (typeof Plugin.dependencies && Plugin.dependencies.length) {
    dependencies = Plugin.dependencies.reduce((deps, dep) => {
      deps[dep] = this[dep]
      return deps
    }, {})
  }
  this[Plugin.plugin_name] = new Plugin(dependencies)
  this.log.info('registered plugin:', Plugin.plugin_name, Plugin.version)
}

module.exports = Koop
