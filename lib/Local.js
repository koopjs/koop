module.exports = {
  /**
   * local cache (it's just a pojo)
   * @type {Object}
   */
  store: {

    /**
     * stores registered services by service type
     * @type {Object}
     */
    services: {},

    /**
     * stores timers by id
     * @type {Object}
     */
    timers: {}
  },

  /**
   * get data out of the store
   *
   * @param  {string}   key - object id
   * @param  {object}   options - layer (number)
   * @param  {function} callback - err, stored object || undefined
   */
  select: function (key, options, callback) {
    var keys = key.split(':')

    if (isNaN(keys[keys.length - 1])) key += ':' + (options.layer || 0)
    if (!this.store[key]) return callback(new Error('Not found'))

    callback(null, [this.store[key]])
  },

  /**
   * gets count of features from an object in the store
   *
   * @param  {string}   key - object id
   * @param  {object}   options - unused
   * @param  {function} callback - feature count (number)
   */
  getCount: function (key, options, callback) {
    if (!this.store[key]) return callback(new Error('Not found'))
    callback(null, this.store[key].features.length)
  },

  /**
   * gets info from stored object
   *
   * @param  {string}   key - object id
   * @param  {function} callback - info object
   */
  getInfo: function (key, callback) {
    if (!this.store[key] || !this.store[key].info) return callback(new Error('Info not found'))
    callback(null, this.store[key].info)
  },

  /**
   * updates info for a stored object
   *
   * @param  {string}   key - object id
   * @param  {object}   info - info object
   * @param  {function} callback - returns error or true on success
   */
  updateInfo: function (key, info, callback) {
    if (!this.store[key]) return callback(new Error('Info not found'))
    this.store[key].info = info
    callback(null, true)
  },

  /**
   * inserts new object into store
   *
   * @param  {string}   key - object id
   * @param  {object}   geojson - geojson object
   * @param  {string}   layerId - layer id
   * @param  {Function} callback - true on success
   */
  insert: function (key, geojson, layerId, callback) {
    this.store[key + ':' + layerId] = geojson
    callback(null, true)
  },

  /**
   * inserts partial data into store
   *
   * @param  {string}   key - object id
   * @param  {object}   geojson - geojson object
   * @param  {string}   layerId - layer id
   * @param  {Function} callback - true on success
   */
  insertPartial: function (key, geojson, layerId, callback) {
    var self = this
    geojson.features.forEach(function (feature) {
      self.store[key + ':' + layerId].features.push(feature)
    })
    callback(null, true)
  },

  /**
   * registers new service
   *
   * @param  {string}   type - service type (provider name?)
   * @param  {object}   info - service info
   * @param  {function} callback - true on success
   */
  serviceRegister: function (type, info, callback) {
    if (!this.store.services[type]) {
      this.store.services[type] = {}
    }
    this.store.services[type][info.id] = info
    callback(null, true)
  },

  /**
   * returns count of registered services for a specified service type
   *
   * @param  {string}   type - service type
   * @param  {function} callback - service count (number)
   */
  serviceCount: function (type, callback) {
    var services = this.store.services[type] || {}
    callback(null, Object.keys(services).length)
  },

  /**
   * removes a registered service from the store
   *
   * @param  {string}   type - service type
   * @param  {string}   id - registered service id
   * @param  {function} callback - true on success
   */
  serviceRemove: function (type, id, callback) {
    if (this.store.services[type] && this.store.services[type][id]) {
      this.store.services[type][id] = null
    }
    callback(null, true)
  },

  /**
   * gets a registered service from the store
   * gets parent service object if no ID is specified
   *
   * @param  {string}   type - service type
   * @param  {string}   id - registered service id (optional)
   * @param  {function} callback - registered service or parent service object or empty object
   */
  serviceGet: function (type, id, callback) {
    if (!id) {
      callback(null, this.store.services[type] || {})
    } else {
      callback(null, this.store.services[type][id])
    }
  },

  /**
   * removes object from store
   *
   * @param  {string}   key - object id
   * @param  {function} callback - true on success
   */
  remove: function (key, callback) {
    this.store[key] = null
    callback(null, true)
  },

  /**
   * gets a timer by key
   * @param  {string}   key - timer id
   * @param  {function} callback - timer or false
   */
  timerGet: function (key, callback) {
    if (Date.now() > this.store.timers[key]) {
      this.store.timers[key] = false
    }
    callback(null, this.store.timers[key] || false)
  },

  /**
   * sets a timer
   *
   * @param  {string}   key - timer id
   * @param  {number}   expires - expiration in seconds
   * @param  {function} callback - timer
   */
  timerSet: function (key, expires, callback) {
    this.store.timers[key] = Date.now() + expires
    callback(null, this.store.timers[key])
  },

  /**
   * SQL query - not implemented
   * @param  {string}   sql - SQL statement
   * @param  {function} callback - error
   */
  _query: function (sql, callback) {
    callback(new Error('Not implemented with local cache. Use a SQL-based cache like postGIS instead.'), false)
  }

}
