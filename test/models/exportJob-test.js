/* globals describe, afterEach, before, after, it */
var should = require('should')
var config = require('config')
var koop = require('../../')(config)
var ExportJob = require('../../lib/ExportJob')
var sinon = require('sinon')
var fakeQueue = {
  create: function (queue, options) {
    this.queue = queue
    this.options = options
    return this
  },
  removeOnComplete: function (bool) {
    return this
  },
  save: function (callback) {
    return {
      on: function (event, method) {
        return null
      }
    }
  }
}

var helpers = {
  log: koop.log,
  cache: koop.Cache,
  queue: fakeQueue
}

var options = {
  key: 'key',
  table: 'table',
  format: 'format'
}

describe('Creating a new job', function () {
  before(function (done) {
    sinon.stub(helpers.cache, 'updateInfo', function (table, info, callback) {
      callback(null)
    })
    done()
  })

  after(function (done) {
    helpers.cache.updateInfo.restore()
    done()
  })

  afterEach(function (done) {
    helpers.cache.getInfo.restore()
    done()
  })

  it('should create a new job when the key has never been seen before', function (done) {
    var job = new ExportJob(helpers, options, function (err, status, created) {
      should.not.exist(err)
      status.generating.key.progress.should.equal('0%')
      status.generating.key.format.should.equal(true)
      created.should.equal(true)
      done()
    })

    sinon.stub(helpers.cache, 'getInfo', function (table, callback) {
      callback(null, {})
    })

    job.start()
  })

  it('should create a new job when the key is finished processing and the format is new', function (done) {
    var status = {
      generating: {
        key: {
          progress: '100%'
        }
      }
    }

    sinon.stub(helpers.cache, 'getInfo', function (table, callback) {
      callback(null, status)
    })

    var job = new ExportJob(helpers, options, function (err, status, created) {
      should.not.exist(err)
      status.generating.key.format.should.equal(true)
      created.should.equal(true)
      done()
    })

    job.start()
  })

  it('should not create a new job when the key is processing', function (done) {
    var status = {
      generating: {
        key: {
          progress: '50%',
          otherFormat: true
        }
      }
    }

    sinon.stub(helpers.cache, 'getInfo', function (table, callback) {
      callback(null, status)
    })

    var job = new ExportJob(helpers, options, function (err, status, created) {
      should.not.exist(err)
      created.should.equal(false)
      done()
    })

    job.start()
  })

  it('should not create a new job when the format has already been requested', function (done) {
    var status = {
      generating: {
        key: {
          progress: '100%',
          format: true
        }
      }
    }

    sinon.stub(helpers.cache, 'getInfo', function (table, callback) {
      callback(null, status)
    })

    var job = new ExportJob(helpers, options, function (err, status, created) {
      should.not.exist(err)
      created.should.equal(false)
      done()
    })

    job.start()
  })
})
