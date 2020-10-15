/* @flow */
'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const pkg = require('./package.json')
const _ = require('lodash')
const Cache = require('koop-cache-memory')
const Logger = require('@koopjs/logger')
const datasetsProvider = require('./lib/datasets')
const ProviderRegistration = require('./lib/provider-registration')
const middleware = require('./lib/middleware')
const Events = require('events')
const Util = require('util')
const path = require('path')
const geoservices = require('@koopjs/output-geoservices')
const LocalFS = require('koop-localfs')

function Koop (config) {
  this.version = pkg.version
  this.config = config || require('config')
  this.server = initServer(this.config)

  // default to LocalDB cache
  // cache registration overrides this
  this.cache = new Cache()
  this.log = new Logger(this.config)
  this.providers = []
  this.pluginRoutes = []
  this.outputs = []
  this.register(geoservices)
  this.register(LocalFS)
  this.register(datasetsProvider)

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
  this._authModule = auth
}

/**
 * registers a provider
 * exposes the provider's routes, controller, and model
 *
 * @param {object} provider - the provider to be registered
 */
Koop.prototype._registerProvider = function (provider, options = {}) {
  const providerRegistration = ProviderRegistration.create({ koop: this, provider, options })
  this.providers.push(providerRegistration)
  this.log.info('registered provider:', providerRegistration.namespace, providerRegistration.version)
}

/**
 * registers a provider
 * exposes the provider's routes, controller, and model
 *
 * @param {object} output - the output plugin to be registered
 */
Koop.prototype._registerOutput = function (Output) {
  this.outputs.push(Output)
  this.log.info('registered output:', Output.name, Output.version)
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
