var kue = require('kue')

module.exports = {
  /**
   * Creates a new export queue
   *
   * @param {object} options - contains configuration for the queue and a logger
   */
  create: function (options) {
    var log = options.log
    var export_q = kue.createQueue({
      prefix: options.redis.prefix,
      disableSearch: true,
      redis: {
        port: options.redis.port,
        host: options.redis.host
      }
    })

    export_q.on('failed', function (id, jobErr) {
      kue.Job.get(id, function (err, job) {
        if (err) return log.error(JSON.stringify(err), job)
        job.remove(function (err) {
          if (err) return log.debug('Export Workers: failed to remove failed job #' + job.id + ' Error: ' + jobErr)
          log.debug('Export Workers: removed failed job #' + job.id + ' Error: ' + jobErr)
        })
      })
    })
    return export_q
  }
}
