const before = (req, next) => { next() }
const after = (req, data, callback) => { callback(null, data) }

function Model (options = {}) {
  this.cache = options.cache
}

Model.prototype.pull = function (req, callback) {
  const key = (this.createKey) ? this.createKey(req) : createKey(req)
  this.before = this.before || before.bind(this)
  this.after = this.after || after.bind(this)
  this.cache.retrieve(key, req.query, (err, cached) => {
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
            if (data.ttl) this.cache.upsert(key, data, { ttl: data.ttl })
          })
        })
      })
    }
  })
}

function createKey (req) {
  let key = req.url.split('/')[1]
  if (req.params.host) key = [key, req.params.host].join('::')
  if (req.params.id) key = [key, req.params.id].join('::')
  if (req.params.layer) key = [key, req.params.layer].join('::')
  return key
}

function isFresh (geojson) {
  if (!geojson || !geojson.metadata || !geojson.metadata.expires) return true
  else return Date.now() < geojson.metadata.expires
}

module.exports = Model
