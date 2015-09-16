module.exports = {
  store: {
    services: {},
    timers: {}
  },

  // get data out of the store
  select: function (key, options, callback) {
    if (options.layer || options.layer === 0) {
      key = key + ':' + options.layer
    }

    if (!this.store[key]) {
      callback(new Error('Not found'), [])
    } else if (this.store[key] && this.store[key].info && this.store[key].info.status === 'processing' && !options.bypassProcessing) {
      callback(null, [{ status: 'processing' }])
    } else {
      callback(null, [this.store[key]])
    }
  },

  getCount: function (key, options, callback) {
    callback(null, this.store[key].features.length)
  },

  getInfo: function (key, callback) {
    if (this.store[key] && this.store[key].info) {
      callback(null, this.store[key].info)
    } else {
      callback(new Error('Info not found'), false)
    }
  },

  updateInfo: function (key, info, callback) {
    if (this.store[key]) {
      this.store[key].info = info
      callback(null, true)
    } else {
      callback(new Error('Info not found'), false)
    }
  },

  insert: function (key, geojson, layerId, callback) {
    this.store[key + ':' + layerId] = geojson
    callback(null, true)
  },

  insertPartial: function (key, geojson, layerId, callback) {
    var self = this
    geojson.features.forEach(function (feature) {
      self.store[key + ':' + layerId].features.push(feature)
    })
    callback(null, true)
  },

  serviceRegister: function (type, info, callback) {
    if (!this.store.services[type]) {
      this.store.services[type] = {}
    }
    this.store.services[type][info.id] = info
    callback(null, true)
  },

  serviceCount: function (type, callback) {
    var services = this.store.services[type] || {}
    callback(null, Object.keys(services).length)
  },

  serviceRemove: function (type, id, callback) {
    if (this.store.services[type] && this.store.services[type][id]) {
      this.store.services[type][id] = null
    }
    callback(null, true)
  },

  serviceGet: function (type, id, callback) {
    if (!id) {
      callback(null, this.store.services[type] || {})
    } else {
      callback(null, this.store.services[type][id])
    }
  },

  remove: function (key, callback) {
    this.store[key] = null
    callback(null, true)
  },

  timerGet: function (key, callback) {
    if (Date.now() > this.store.timers[key]) {
      this.store.timers[key] = false
    }
    callback(null, this.store.timers[key] || false)
  },

  timerSet: function (key, expires, callback) {
    this.store.timers[key] = Date.now() + expires
    callback(null, this.store.timers[key])
  },

  _query: function (sql, callback) {
    callback(new Error('Not implemented with local cache. Use a SQL-based cache like postGIS instead.'), false)
  }

}
