const alasql = require('./alasql')
const Params = require('./params')

module.exports = function (statement) {
  const query = alasql.compile(statement)
  return function (inParams) {
    const params = Params.prepare(inParams)
    const results = query(params)
    return results
  }
}
