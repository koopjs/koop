function Cache (koop) {
  /**
   * Inserts geojson into the DB
   *
   * @param {string} type - the provider type, used for setting provider based timers etc
   * @param {string} key - a provider based id for a dataset (defined by the provider)
   * @param {object} data - valid geojson
   * @param {number} layerId - the layer id to use in the db
   * @param {function} callback - the callback to return errors and data to
   */
  this.insert = function (type, key, data, layerId, callback) {
    var self = this
    this.db.insert(type + ':' + key, data, layerId, function (err, success) {
      self.timerSet(type + ':' + key + ':timer', 3600000, function (error, timer) {
        if (error) return callback(error)
        callback(err, success)
      })
    })
  }

  /**
   * Insert partial data into the DB
   *
   * @param {string} type - the provider type, used for setting provider based timers etc
   * @param {string} key - a provider based id for a dataset (defined by the provider)
   * @param {object} data - valid geojson
   * @param {number} layerId - the layer id to use in the db
   * @param {function} callback - the callback to return errors and data to
   */
  this.insertPartial = function (type, key, data, layerId, callback) {
    this.db.insertPartial(type + ':' + key, data, layerId, function (err, success) {
      callback(err, success)
    })
  }

  /**
   * Handles the response from the DB select for feature data
   * if a cache timer has expired we ask if the data in the 3rd party API has changed
   * if it has changed then each Model's checkthis function will return the NEW data
   * if it hasnt changed then checkthis will return false and the old data will be sent back
   *
   * @param {string} type - the provider type, used for setting provider based timers etc
   * @param {string} key - a provider based id for a dataset (defined by the provider)
   * @param {object} data - valid geojson
   * @param {object} options - optional query params like where, geometry
   * @param {function} callback - the callback to return errors and data to
   */
  this.process = function (type, key, data, options, callback) {
    var self = this
    // timing at which we'll check the validity of the cache
    var checkTime = (60 * 60 * 1000) // 60 mins

    if (!data.length) {
      callback('Not found', null)
    } else {
      // checks the timer
      var timerKey = [type, key, (options.layer || 0), 'timer'].join(':')

      this.db.timerGet(timerKey, function (error, timer) {
        if (error) return callback(error)

        // got a timer, therefore we are good and just return
        if (timer) return callback(null, data)

        // expired, hit the API to check the latest sha
        if (global[type] && global[type].checkCache) {
          global[type].checkCache(key, data, options, function (err, success) {
            if (err) return callback(err)

            if (!success) {
              // false is good -> reset timer and return data
              // cache returned true, return current data
              self.db.timerSet(timerKey, checkTime, function (error, timer) {
                if (error) return callback(error)
                callback(null, data)
              })
            } else {
              // we need to remove and save new data
              self.remove(type, key, options, function () {
                self.insert(type, key, data, (options.layer || 0), function (err, res) {
                  self.db.timerSet(timerKey, checkTime, function (error, timer) {
                    if (error) return callback(error)
                    callback(err, success)
                  })
                })
              })
            }
          })
        } else {
          callback(null, data)
        }
      })
    }
  }

  /**
   * Remove features from the DB
   *
   * @param {string} type - the provider type, used for setting provider based timers etc
   * @param {string} key - a provider based id for a dataset (defined by the provider)
   * @param {object} options - optional query params like where, geometry
   * @param {function} callback - the callback to return errors and data to
   */
  this.remove = function (type, key, options, callback) {
    this.db.remove(type + ':' + key + ':' + (options.layer || 0), function (err, result) {
      if (err) return callback(err)
      if (callback) callback(null, true)
    })
  }

  /**
   * Get features from the DB
   * calls the "select" methon on the DB
   * TODO make this use a table name instead of "type" and "key"
   *
   * @param {string} type - the provider type, used for setting provider based timers etc
   * @param {string} key - a provider based id for a dataset (defined by the provider)
   * @param {object} options - optional query params like where, geometry
   * @param {function} callback - the callback to return errors and data to
   */
  this.get = function (type, key, options, callback) {
    var self = this
    var table = type + ':' + key
    this.db.select(table, options, function (err, result) {
      if (err) return callback(err)
      self.process(type, key, result, options, callback)
    })
  }

  /**
   * Get the metadata for a dataset
   *
   * @param {string} table - the name of the table
   * @param {function} callback - the callback to return errors and data to
   */
  this.getInfo = function (table, callback) {
    this.db.getInfo(table, callback)
  }

  /**
   * Update the metadata for a dataset
   *
   * @param {string} table - the name of the table
   * @param {object} info - the metadata to update in the DB
   * @param {function} callback - the callback to return errors and data to
   */
  this.updateInfo = function (table, info, callback) {
    this.db.updateInfo(table, info, callback)
  }

  /**
   * Gets the count of features in the db table
   *
   * @param {string} table - the name of the table
   * @param {object} options - optional params like where, geometry or groupby
   * @param {function} callback - the callback to return errors and data to
   */
  this.getCount = function (table, options, callback) {
    this.db.getCount(table, options, callback)
  }

  /**
   * Gets the extent of features in the db table
   *
   * @param {string} table - the name of the table
   * @param {object} options - optional params like where, geometry or groupby
   * @param {function} callback - the callback to return errors and data to
   */
  this.getExtent = function (table, options, callback) {
    if (this.db.getExtent) {
      this.db.getExtent(table, options, callback)
    } else {
      callback()
    }
  }

  /**
   * Gets a statistic for a field
   *
   * @param {string} field - the field to create the stat from
   * @param {string} outName - the name of the output field
   * @param {string} type - the stat type: min, max, avg, stddev, count, or sum
   * @param {object} options - optional params like where, geometry or groupby
   * @param {function} callback - the callback to return errors and data to
   */
  this.getStat = function (field, outName, type, options, callback) {
    this.db.getStat(field, outName, type, options, callback)
  }

  /**
   * Count the number of services registered for a service type
   *
   * @param {string} type - the type of service
   * @param {function} callback - the callback to return errors and data to
   */
  this.serviceCount = function (type, callback) {
    this.db.serviceCount(type, callback)
  }

  /**
   * Get a registered service for a service type
   * if no id given, should return array of all services for that type
   *
   * @param {string} type - the type of service
   * @param {string} id - optional service id to get
   * @param {function} callback - the callback to return errors and data to
   */
  this.serviceGet = function (type, id, callback) {
    this.db.serviceGet(type, id, callback)
  }

  /**
   * Register a service with a host and an id and a service type
   *
   * @param {string} type - the type of service
   * @param {object} info - an object with a host and an id to register
   * @param {function} callback - the callback to return errors and data to
   */
  this.serviceRegister = function (type, info, callback) {
    this.db.serviceRegister(type, info, callback)
  }

  /**
   * Remove a registered service for a service type
   *
   * @param {string} type - the type of service
   * @param {string} id - optional service id to remove
   * @param {function} callback - the callback to return any errors
   */
  this.serviceRemove = function (type, id, callback) {
    this.db.serviceRemove(type, id, callback)
  }

  /**
   * Set a timer in the DB for a table
   *
   * Timers are used as a way to prevent providers from checking for data
   * changes in APIs on every request. Once data are cached a timer of an 60 mins
   * is used to prevent the provider from asking the API is the data have changed.
   *
   * @param {string} table - the table to create a timer for
   * @param {number} length - the length of the timer in milliseconds
   * @param {function} callback - the callback to return any errors
   */
  this.timerSet = function (table, length, callback) {
    this.db.timerSet(table, length, callback)
  }

  /**
   * Gets a timer for a table
   *
   * @param {string} table - the table for which to get any timer
   * @param {function} callback - the callback to return any errors
   */
  this.timerGet = function (table, callback) {
    this.db.timerGet(table, callback)
  }

  return this

}

module.exports = Cache
