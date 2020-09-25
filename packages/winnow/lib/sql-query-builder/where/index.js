const translateSqlWhere = require('./translate-sql-where')
const createGeometryPredicate = require('./geometry-predicate')

function createWhereClause (options = {}) {
  const { where, geometry } = options
  if (!where && !geometry) return ''

  const fragments = []

  if (where) {
    fragments.push(translateSqlWhere(options))
  }

  if (geometry) {
    fragments.push(createGeometryPredicate(options))
  }

  return ` WHERE ${fragments.join(' AND ')}`
}

module.exports = createWhereClause
