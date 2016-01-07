var kooplib = require('../../src/lib')
var config = { logfile: __dirname + '/../test.log' }

// init the koop log based on config params
kooplib.log = new kooplib.Logger(config)

var Cache = new kooplib.DataCache(kooplib)
Cache.db = kooplib.LocalDB
Cache.db.log = kooplib.log
exports.config = config
exports.cache = Cache
