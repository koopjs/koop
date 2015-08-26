var express = require('express')
var bodyParser = require('body-parser')
var pkg = require('./package')
var _ = require('lodash')
var multipart = require('connect-multiparty')()
var lib = require('./lib')

module.exports = function (config) {
  var koop = express()

  // inherit everything from lib ¯\_(ツ)_/¯
  for (var method in lib) {
    if (lib.hasOwnProperty(method)) koop[method] = lib[method]
  }

  koop.config = config || {}
  koop.log = new koop.Logger(koop.config)

  // init koop centralized file access
  // this allows us to turn the FS access off globally
  koop.files = new koop.Files({
    config: koop.config,
    log: koop.log
  })

  // the default cache is the local in-mem cache
  // to persist data you must call registerCache with db adapter
  // use the default local cache until a DB adapter mod is registered
  koop.Cache = new koop.DataCache()
  koop.Cache.db = koop.LocalDB

  if (!koop.config.db || !koop.config.db.conn) {
    koop.log.warn('No cache configured, defaulting to local in-memory cache. No data will be cached across server sessions.')
  }

  // expose default routes for later additions & edits by plugins
  koop.defaultRoutes = {
    'featureserver': ['/FeatureServer/:layer/:method', '/FeatureServer/:layer', '/FeatureServer'],
    'preview': ['/preview'],
    'drop': ['/drop']
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

  // object for keeping track of registered services
  // TODO: why not called providers?
  // if services includes caches and plugins we should put them in here too
  koop.services = {}
  koop.status = {
    version: pkg.version,
    providers: {}
  }

  /**
   * public methods
   */

  /**
   * registers providers, caches, and plugins
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

    koop.log.warn('Plugin missing type property. Defaulting to provider.')
    koop.registerProvider(plugin)
  }

  /**
   * registers a provider
   * exposes the provider's routes, controller, and model
   * @param {object} provider - the provider to be registered
   */
  koop.registerProvider = function (provider) {
    koop.services[provider.name] = provider

    var model = provider.model(koop)
    var controller = provider.controller(model, koop.BaseController)
    provider.version = provider.version || '(version missing)'

    // if a provider has a status object store it
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
   * @param {object} any koop plugin
   */
  koop.registerPlugin = function (plugin) {
    koop[plugin.name] = plugin
    koop.log.info('registered plugin:', plugin.name, plugin.version)
  }

  // assigns a series of default routes; assumes
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

  // bind each route in a list to controller handler
  koop._bindRoutes = function (routes, controller) {
    for (var route in routes) {
      var path = route.split(' ')
      koop[path[0]](path[1], controller[routes[route]])
    }
  }

  /**
   * route definitions
   */

  // serve all the provider json
  koop.get('/providers', function (req, res, next) {
    res.json(koop.services)
  })

  // serve up a provider
  koop.get('/providers/:provider', function (req, res, next) {
    res.json(koop.services[req.params.provider])
  })

  // gets all the datasets in the cache for a provider
  koop.get('/providers/:provider/datasets', function (req, res, next) {
    koop.Cache.db._query("select * from koopinfo where id ilike '%" + req.params.provider + "%'", function (err, result) {
      if (err) return res.status(500).send(err)
      res.json(result.rows)
    })
  })

  /**
   * export worker setup
   *
   * if export workers are configured:
   * 1. creates exporter workers
   * 2. connects the worker queue for large exports
   * 3. adds export-workers route
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

  return koop
}
