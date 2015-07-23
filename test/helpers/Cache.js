var kooplib = require('../../lib')
var DataCache = kooplib.DataCache
var config = require('config')

config.logfile = __dirname + '/../test.log'

// init the koop log based on config params
kooplib.log = new kooplib.Logger(config)

var Cache = new DataCache(kooplib)
Cache.db = kooplib.LocalDB
Cache.db.log = kooplib.log
exports.config = config
exports.cache = Cache
