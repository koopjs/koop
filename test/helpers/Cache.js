const Cache = require('../../src/cache')
const local = require('../../src/local')
const path = require('path')
var config = { logfile: path.join(__dirname, '/../test.log') }

// init the koop log based on config params
const Logger = require('koop-logger')
const log = new Logger(config)

exports.cache = new Cache()
exports.config = config
exports.cache.db = local
exports.cache.db.log = log
