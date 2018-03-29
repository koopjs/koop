const aggregates = require('./aggregates')
const createGeometryClause = require('./geometry').createClause
const createFieldsClause = require('./fields').createClause

function createClause (options) {
  if (options.aggregates) return aggregates(options.aggregates, options.groupBy, options.esri)

  var fieldsClause = createFieldsClause(options)

  if (options.returnGeometry === false) {
    return (`SELECT ${fieldsClause} FROM ?`)
  }

  return (`SELECT ${fieldsClause}, ${createGeometryClause(options)} FROM ?`)
}

module.exports = { createClause }
