var express = require('express')
var bodyParser = require('body-parser')
var pkg = require('./package')
var _ = require('lodash')
var multipart = require('connect-multiparty')()
var lib = require('./lib')

module.exports = function (config) {
  var koop = express()

  // inherit everything from lib
  // TODO: only expose constructors and methods that are used by other modules
  // TODO: deprecate then remove exposed lib modules from koop
  for (var method in lib) {
    if (lib.hasOwnProperty(method)) koop[method] = lib[method]
  }

  koop.version = pkg.version
  koop.config = config || {}
  koop.log = new koop.Logger(koop.config)
  koop.files = new koop.Files({
    config: koop.config,
    log: koop.log
  })

  // default to LocalDB cache
  // cache registration overrides this
  // TODO: instance should be lowercased
  koop.Cache = new koop.DataCache()
  koop.Cache.db = koop.LocalDB

  // object for keeping track of registered services
  // TODO: why not called providers?
  // if services includes caches and plugins we should put them in here too
  koop.services = {}

  // TODO: consolidate status, services, `/providers` routes
  koop.status = {
    version: koop.version,
    providers: {}
  }

  // expose default routes for later additions & edits by plugins
  koop.defaultRoutes = {
    'featureserver': ['/FeatureServer/:layer/:method', '/FeatureServer/:layer', '/FeatureServer'],
    'preview': ['/preview'],
    'drop': ['/drop']
  }

  if (!koop.config.db || !koop.config.db.conn) {
    koop.log.warn('No cache configured, defaulting to local in-memory cache. No data will be cached across server sessions.')
  }

  /**
   * express middleware setup
   */

  // handle POST requests
  // parse application/x-www-form-urlencoded
  koop.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  koop.use(bodyParser.json())

  koop.use(function (req, res, next) {
    // request parameters can come from query url or POST body
    req.query = _.extend(req.query || {}, req.body || {})

    // remove the x powered by header from all responses
    res.removeHeader('X-Powered-By')
    next()
  })

  // for demos and preview maps in providers
  koop.set('view engine', 'ejs')
  koop.use(express.static(__dirname + '/public'))

  /**
   * public methods
   */

  /**
   * general method for registering providers, caches, and plugins
   *
   * @param {object} plugin - module to be registered
   */
  koop.register = function (plugin) {
    if (typeof plugin === 'undefined') throw new Error('Plugin undefined.')
    if (!plugin.name) throw new Error('Cannot register plugin: missing name.')

    if (plugin.type) {
      if (plugin.type === 'provider') return koop.registerProvider(plugin)
      if (plugin.type === 'cache') return koop.registerCache(plugin)
      if (plugin.type === 'plugin') return koop.registerPlugin(plugin)

      koop.log.warn('Unrecognized plugin type: "' + plugin.type + '". Defaulting to provider.')
      return koop.registerProvider(plugin)
    }

    koop.log.warn('Plugin "%s" missing type property. Defaulting to provider.', plugin.name)
    koop.registerProvider(plugin)
  }

  /**
   * registers a provider
   * exposes the provider's routes, controller, and model
   *
   * @param {object} provider - the provider to be registered
   */
  koop.registerProvider = function (provider) {
    koop.services[provider.name] = provider

    var model = provider.model(koop)
    var controller = provider.controller(model, koop.BaseController)
    provider.version = provider.version || '(version missing)'

    // if a provider has a status object store it
    // TODO: deprecate & serve more meaningful status reports dynamically.
    if (provider.status) {
      koop.status.providers[provider.name] = provider.status
      provider.version = provider.status.version
    }

    // binds a series of standard routes
    if (provider.name && provider.pattern) {
      koop._bindDefaultRoutes(provider.name, provider.pattern, controller)
    }

    // add each route, the routes let us override defaults etc.
    koop._bindRoutes(provider.routes, controller)

    koop.log.info('registered provider:', provider.name, provider.version)
  }

  /**
   * registers a cache
   * overwrites any existing koop.Cache.db
   *
   * @param {object} cache - a koop database adapter
   */
  koop.registerCache = function (cache) {
    if (!koop.config.db || !koop.config.db.conn) throw new Error('Cannot register cache: missing config.db.conn.')

    koop.Cache.db = cache.connect(koop.config.db.conn, { log: koop.log })
    koop.log.info('registered cache:', cache.name, cache.version)
  }

  /**
   * registers a plugin
   * Plugins can be any function that you want to have global access to
   * within koop provider models
   *
   * @param {object} any koop plugin
   */
  koop.registerPlugin = function (plugin) {
    koop[plugin.name] = plugin
    koop.log.info('registered plugin:', plugin.name, plugin.version)
  }

  /**
   * creates default routes based on pattern from provider
   *
   * @param {string} name - provider name
   * @param {string} pattern - route pattern from provider
   * @param {object} controller - provider controller
   */
  koop._bindDefaultRoutes = function (name, pattern, controller) {
    for (var handler in koop.defaultRoutes) {
      if (controller[handler]) {
        koop.defaultRoutes[handler].forEach(function (route) {
          koop.get('/' + name + pattern + route, controller[handler])
          // add multipart middleware for POSTs to featureservices
          koop.post('/' + name + pattern + route, multipart, controller[handler])
        })
      }
    }
  }

  /**
   * binds each route from provider routes object to corresponding controller handler
   *
   * @param {object} routes - provider routes
   * @param {object} controller - provider controller
   */
  koop._bindRoutes = function (routes, controller) {
    for (var route in routes) {
      var path = route.split(' ')
      koop[path[0]](path[1], controller[routes[route]])
    }
  }

  /**
   * route definitions
   */

  /**
   * serves koop.services object
   *
   * @param {object} req - incoming request
   * @param {object} res - outgoing response
   */
  koop.get('/providers', function (req, res) {
    res.json(koop.services)
  })

  /**
   * serves provider information by name from koop.services
   *
   * @param {object} req - incoming request
   * @param {object} res - outgoing response
   */
  koop.get('/providers/:provider', function (req, res) {
    res.json(koop.services[req.params.provider])
  })

  /**
   * gets all the datasets in the cache for a provider
   *
   * @param {object} req - incoming request
   * @param {object} res - outgoing response
   */
  koop.get('/providers/:provider/datasets', function (req, res) {
    var sqlQuery = "select * from koopinfo where id ilike '%" + req.params.provider + "%'"

    koop.Cache.db._query(sqlQuery, function (err, result) {
      if (err) return res.status(500).send(err)
      res.json(result.rows)
    })
  })

  /**
   * export worker setup
   *
   * if export workers are configured:
   * 1. creates export workers
   * 2. connects the worker queue for large exports
   * 3. adds export-workers route
   *
   * TODO: remove worker logic from index
   */

  if (koop.config.export_workers) {
    var kue = require('kue')

    koop.Exporter.export_q = kue.createQueue({
      prefix: koop.config.export_workers.redis.prefix,
      disableSearch: true,
      redis: {
        port: koop.config.export_workers.redis.port,
        host: koop.config.export_workers.redis.host
      }
    })

    // remove completed jobs from the queue
    koop.Exporter.export_q.on('job complete', function (id) {
      kue.Job.get(id, function (err, job) {
        if (err) return // TODO: should we do more than just return here?
        job.remove(function (err) {
          if (err) {
            koop.log.debug('Export Workers: could not remove completed job #' + job.id)
          }
          koop.log.debug('Export Workers: removed completed job #' + job.id + ' - ' + id)
        })
      })
    })

    koop.Exporter.export_q.on('job failed', function (id, jobErr) {
      kue.Job.get(id, function (err, job) {
        if (err) return // TODO: should we do more than just return here?
        job.remove(function (err) {
          if (err) {
            koop.log.debug(err)
            koop.log.debug('Export Workers: failed to remove failed job #' + job.id + ' Error: ' + jobErr)
          } else {
            koop.log.debug('Export Workers: removed failed job #' + job.id + ' Error: ' + jobErr)
          }
        })
      })
    })

    koop.collectQStats = function (q, json, type, callback) {
      q[type](function (err, count) {
        if (err) return callback(err)
        json[type.replace('Count', '')] = count
        callback(null, json)
      })
    }

    /**
     * returns information about export workers
     *
     * @param {object} req - incoming request
     * @param {object} res - outgoing response
     */
    koop.get('/export-workers', function (req, res) {
      var response = {}
      var count = 0
      var jobTypes = ['inactiveCount', 'activeCount', 'completeCount', 'failedCount', 'delayedCount']
      var error

      // for (var type in jobTypes){
      function getJobCounts (type) {
        koop.collectQStats(koop.Exporter.export_q, response, type, function (err, json) {
          count++
          if (err) {
            error = err
          }
          // save the response
          response = json

          // get more if there are more types
          if (jobTypes[count]) {
            getJobCounts(jobTypes[count])
          } else {
            // return the response
            if (error) {
              res.status(500).send(err)
            } else {
              res.json(response)
            }
          }
        })
      }

      getJobCounts(jobTypes[count])
    })
  }

  koop.on('mount', function (parent) {
    koop.log.info('Koop %s mounted at %s', koop.version, koop.mountpath)
  })

  return koop
}
