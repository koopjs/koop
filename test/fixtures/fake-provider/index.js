exports.name = 'test-provider'
exports.pattern = '/:id'
exports.controller = require('./controller')
exports.routes = require('./routes')
exports.model = require('./models/fake')
