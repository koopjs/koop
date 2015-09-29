/**
 * Export Job constructor, creates and manages export jobs through their lifecycle
 *
 * @class
 * @param {object} cache - the place where info about this job is stored
 * @param {object} log - a logger to use
 * @param {object} options - set of options describing how to create an export job
 * @param {function} callback - calls back with an error or a status
 */
function ExportJob (helpers, options, done) {
  this.cache = helpers.cache
  this.queue = helpers.queue
  this.log = helpers.log
  this.options = options
  this.done = done
  this.completed = 0
}

/**
 * Starts a new export job if appropriate
 */
ExportJob.prototype.start = function () {
  var self = this
  self._checkLock(function (locked) {
    // if the job is locked, then we just want to return status
    if (locked) return self.done(null, self.status, false)
    self._createLock(function (err) {
      if (err) return self.done(err)
      self.done(null, self.status, true)
      self.job = self.queue.create('exports', self.options).removeOnComplete(true).save(function (err) {
        if (err) {
          self.log.error('Unable to add job to export queue: ' + err + ' ' + JSON.stringify(self.options))
          return self.done(err)
        }
        self.log.debug('Added job to export queue ' + self.job.id)
      })
      self.job.on('progress', self._updateProgress.bind(self)) // TODO is this binding necessary?
    })
  })
}

/**
 * Checks to see if a export job type should proceed
 *
 * @param {function} callback - calls back with a decision on whether to proceed and info
 * @private
 */
ExportJob.prototype._checkLock = function (callback) {
  var self = this
  var key = self.options.key
  var format = self.options.format
  self.cache.getInfo(self.options.table, function (err, info) {
    // save status to the ExportJob object because we're going to keep updating it
    self.status = info
    if (err) return self.done(err)
    // this key doesn't exist at all in the generating object -> new job
    if (!info.generating || !info.generating[key]) return callback(false)
    // koop is in the process of requesting rows from the DB -> no new job
    if (info.generating[key].progress && info.generating[key].progress !== '100%') return callback(true)
    // koop is currently creating this format for this resource and key -> no new job
    if (info.generating[key][format]) return callback(true)
    // koop has already gotten the rows from the db but hasn't seen this format before -> new job
    callback(false)
  })
}

/**
 * Creates a lock on the data and/or export format
 *
 * @param {function} callback - calls back with an error or nothing
 */
ExportJob.prototype._createLock = function (callback) {
  var status = this.status
  var key = this.options.key
  var format = this.options.format

  status.generating = status.generating ? status.generating : {}
  status.generating[key] = status.generating[key] || {progress: 0 + '%'}
  status.generating[key].start = Date.now()
  status.generating[key][format] = true
  this.cache.updateInfo(this.options.table, status, callback)
}

/**
 * Updates the progress of a particular export job in the db
 * We request info before updating it is that we cannot
 * update postgres json in place and another worker may be processing
 * a different data key
 *
 * @param {float} progress - measure of database rows written to disk
 * @private
 */
ExportJob.prototype._updateProgress = function (pages, length) {
  var self = this
  self.completed++
  var progress = (self.completed / length) * 100
  self.cache.getInfo(self.options.table, function (err, info) {
    if (err) return self.done(err)
    info.generating[self.options.key].progress = progress + '%'
    self.cache.updateInfo(self.options.table, info, function (err) {
      if (err) return self.done(err)
      self.log.debug('job progress: ' + self.job.id + ' ' + progress + '%')
    })
  })
}

module.exports = ExportJob
