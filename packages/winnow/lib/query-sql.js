const filterAndTransform = require('./filter-and-transform')

module.exports = function (statement, params) {
  return filterAndTransform(statement, params)
}
