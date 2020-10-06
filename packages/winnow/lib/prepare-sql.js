const filterAndTransform = require('./filter-and-transform')
const Params = require('./params')

module.exports = function (statement) {
  const query = filterAndTransform.compile(statement)
  return function (inParams) {
    const params = Params.prepare(inParams)
    const results = query(params)
    return results
  }
}
