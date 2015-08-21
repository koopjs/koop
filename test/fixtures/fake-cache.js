var LocalDB = require('../../lib/Local')

var fake = Object.create(LocalDB)

fake.name = 'test-cache'
fake.type = 'cache'
fake.version = '0.0.0'

fake.connect = function (conn, koop, callback) {
  return this
}

module.exports = fake
