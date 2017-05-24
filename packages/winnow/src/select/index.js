const aggregates = require('./aggregates')
const createGeometryClause = require('./geometry').createClause
const createFieldsClause = require('./fields').createClause

function createClause (options) {
  if (options.aggregates) return aggregates(options.aggregates, options.groupBy, options.esri)
  const geometryClause = createGeometryClause(options)
  const fieldsClause = createFieldsClause(options)

  return `SELECT ${fieldsClause}, ${geometryClause} FROM ?`
}

module.exports = { createClause }
