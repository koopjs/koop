var express = require('express')
var bodyParser = require('body-parser')
var pkg = require('./package')
var _ = require('lodash')
var multipart = require('connect-multiparty')()
var koop = require('./lib')

module.exports = function (config) {
  var app = express()

  /**
   * koop setup
   */

  koop.config = config = config || {}
  koop.log = new koop.Logger(config)

  // init koop centralized file access
  // this allows us to turn the FS access off globally
  koop.files = new koop.Files({
    config: config,
    log: koop.log
  })

  // the default cache is the local in-mem cache
  // to persist data you must call registerCache with db adapter
  // use the default local cache until a DB adapter mod is registered
  koop.Cache = new koop.DataCache(koop)
  koop.Cache.db = koop.LocalDB

  if (!config.db || !config.db.conn) {
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

  // object for keeping track of registered services
  // TODO: why not called providers?
  // if services includes caches and plugins we should put them in here too
  app.services = {}

  // for demos and preview maps in providers
  app.set('view engine', 'ejs')

  // handle POST requests
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  // request parameters can come from query url or POST body
  app.use(function (req, res, next) {
    req.query = _.extend(req.query || {}, req.body || {})
    next()
  })

  // remove the x powered by header from all responses
  app.use(function (req, res, next) {
    res.removeHeader('X-Powered-By')
    next()
  })

  app.use(express.static(__dirname + '/public'))

  // store the sha so we know what version of koop this is
  app.status = {
    version: pkg.version,
    providers: {}
  }

  /**
   * route definitions
   */

  // serve all the provider json
  app.get('/providers', function (req, res, next) {
    res.json(app.services)
  })

  // serve up a provider
  app.get('/providers/:provider', function (req, res, next) {
    res.json(app.services[req.params.provider])
  })

  // gets all the datasets in the cache for a provider
  app.get('/providers/:provider/datasets', function (req, res, next) {
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
        if (err) return
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
        if (err) return
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
        if (err) {
          return callback(err)
        }
        json[type.replace('Count', '')] = count
        callback(null, json)
      })
    }

    app.get('/export-workers', function (req, res) {
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

  /**
   * app methods
   */

  /**
   * registers koop providers, caches, and plugins
   * @param {object} plugin - module to be registered
   */
  app.register = function (plugin) {
    if (typeof plugin === 'undefined') return koop.log.error('Plugin undefined, skipping registration.')
    if (!plugin.name) return koop.log.error('Plugin missing name, skipping registration.')

    if (plugin.type) {
      if (plugin.type === 'provider') return app.registerProvider(plugin)
      if (plugin.type === 'cache') return app.registerCache(plugin)
      if (plugin.type === 'plugin') return app.registerPlugin(plugin)

      koop.log.warn('Unrecognized plugin type. Defaulting to provider.')
      return app.registerProvider(plugin)
    }

    koop.log.warn('Plugin missing type property. Defaulting to provider.')
    app.registerProvider(plugin)
  }

  /**
   * registers koop providers
   * exposes the provider's routes, controller, and model
   * @param {object} provider - the provider to be registered
   */
  app.registerProvider = function (provider) {
    app.services[provider.name] = provider

    var model = provider.model(koop)
    var controller = provider.controller(model, koop.BaseController)

    // if a provider has a status object store it
    if (provider.status) {
      app.status.providers[provider.name] = provider.status
    }

    // binds a series of standard routes
    if (provider.name && provider.pattern) {
      app._bindDefaultRoutes(provider.name, provider.pattern, controller)
    }

    // add each route, the routes let us override defaults etc.
    app._bindRoutes(provider.routes, controller)
  }

  /**
   * registers a koop cache
   * overwrites any existing koop.Cache.db
   * @param {object} cache - a koop database adapter
   */
  app.registerCache = function (cache) {
    if (!config.db || !config.db.conn) {
      return koop.log.error('Cannot register cache. Missing db.conn property in config.')
    }

    koop.Cache.db = cache.connect(config.db.conn, koop)
  }

  /**
   * registers a koop plugin
   * Plugins can be any function that you want to have global access to
   * within koop provider models
   * @param {object} any koop plugin
   */
  app.registerPlugin = function (plugin) {
    koop[plugin.name] = plugin
  }

  // assigns a series of default routes; assumes
  app._bindDefaultRoutes = function (name, pattern, controller) {
    for (var handler in koop.defaultRoutes) {
      if (controller[handler]) {
        koop.defaultRoutes[handler].forEach(function (route) {
          app.get('/' + name + pattern + route, controller[handler])
          // add multipart middleware for POSTs to featureservices
          app.post('/' + name + pattern + route, multipart, controller[handler])
        })
      }
    }
  }

  // bind each route in a list to controller handler
  app._bindRoutes = function (routes, controller) {
    for (var route in routes) {
      var path = route.split(' ')
      app[path[0]](path[1], controller[routes[route]])
    }
  }

  return app
}
