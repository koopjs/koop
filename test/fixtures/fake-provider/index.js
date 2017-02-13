exports.name = 'test-provider'
exports.type = 'provider'
exports.status = { version: '0.0.0' }
exports.Controller = require('./controller')
exports.routes = require('./routes')
exports.Model = require('./models/fake')
