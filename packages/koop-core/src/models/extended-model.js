const _ = require('lodash')
const before = (req, next) => { next() }
const after = (req, data, callback) => { callback(null, data) }

module.exports = class ExtendedModel {
  constructor ({ ProviderModel, koop }, options = {}) {
    // Extend the passsed in provider model
    class Model extends ProviderModel {
      constructor (koop, options) {
        // Merging the koop object into options to preserve backward compatibility; consider removing in Koop 4.x
        const modelOptions = _.chain(options).omit(options, 'cache', 'before', 'after').assign(koop).value()
        super(modelOptions)
        this.cache = options.cache || koop.cache
        this.before = options.before
        this.after = options.after
        this.options = modelOptions
      }

      pull (req, callback) {
        const key = (this.createKey) ? this.createKey(req) : createKey(req)
        const dataKey = `${key}::data`
        this.before = this.before || before.bind(this)
        this.after = this.after || after.bind(this)
        this.cache.retrieve(dataKey, req.query, (err, cached) => {
          if (!err && isFresh(cached)) {
            callback(null, cached)
          } else {
            this.before(req, (err) => {
              if (err) return callback(err)
              this.getData(req, (err, data) => {
                if (err) return callback(err)
                this.after(req, data, (err, data) => {
                  if (err) return callback(err)
                  callback(null, data)
                  if (data.ttl) this.cache.upsert(dataKey, data, { ttl: data.ttl })
                })
              })
            })
          }
        })
      }

      // TODO: the pullLayer() and the pullCatalog() are very similar to the pull()
      // function. We may consider to merging them in the future.
      pullLayer (req, callback) {
        const key = (this.createKey) ? this.createKey(req) : createKey(req)
        const layerKey = `${key}::layer`
        this.cache.retrieve(layerKey, req.query, (err, cached) => {
          if (!err && isFresh(cached)) {
            callback(null, cached)
          } else if (this.getLayer) {
            this.getLayer(req, (err, data) => {
              if (err) return callback(err)
              callback(null, data)
              if (data.ttl) this.cache.upsert(layerKey, data, { ttl: data.ttl })
            })
          } else {
            callback(new Error('getLayer() function is not implemented in the provider.'))
          }
        })
      }

      pullCatalog (req, callback) {
        const key = (this.createKey) ? this.createKey(req) : createKey(req)
        const catalogKey = `${key}::catalog`
        this.cache.retrieve(catalogKey, req.query, (err, cached) => {
          if (!err && isFresh(cached)) {
            callback(null, cached)
          } else if (this.getCatalog) {
            this.getCatalog(req, (err, data) => {
              if (err) return callback(err)
              callback(null, data)
              if (data.ttl) this.cache.upsert(catalogKey, data, { ttl: data.ttl })
            })
          } else {
            callback(new Error('getCatalog() function is not implemented in the provider.'))
          }
        })
      }
    }

    return new Model(koop, options)
  }
}

function createKey (req) {
  let key = req.url.split('/')[1]
  if (req.params.host) key = [key, req.params.host].join('::')
  if (req.params.id) key = [key, req.params.id].join('::')
  if (req.params.layer) key = [key, req.params.layer].join('::')
  return key
}

function isFresh (geojson) {
  // TODO: if the cache plugin developer forgets to set the metadata.expires,
  // the data will be forever fresh. This should be fixed.
  if (!geojson || !geojson.metadata || !geojson.metadata.expires) return true
  else return Date.now() < geojson.metadata.expires
}
