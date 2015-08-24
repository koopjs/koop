exports.name = 'test-provider'
exports.pattern = '/:id'
exports.type = 'provider'
exports.status = { version: '0.0.0' }
exports.controller = require('./controller')
exports.routes = require('./routes')
exports.model = require('./models/fake')
