const alasql = require('./alasql')

module.exports = function (statement, params) {
  return alasql(statement, params)
}
