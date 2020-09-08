const aggregates = require('./aggregate-select')
const createGeometryClause = require('./geometry-fragment').createClause
const createFieldsClause = require('./fields-fragment').createClause

function createClause (options) {
  if (options.aggregates) return aggregates(options.aggregates, options.groupBy, options.esri)

  var fieldsClause = createFieldsClause(options)

  if (options.returnGeometry === false) {
    return (`SELECT ${fieldsClause} FROM ?`)
  }

  return (`SELECT ${fieldsClause}, ${createGeometryClause(options)} FROM ?`)
}

module.exports = { createClause }
