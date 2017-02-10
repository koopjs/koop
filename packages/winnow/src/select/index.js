const fields = require('./fields')
const aggregates = require('./aggregates')
const toEsri = require('./toEsri')

function createClause (options) {
  if (options.aggregates) return aggregates(options.aggregates, options.groupBy, options.esri)
  else if (options.fields) return fields(options.fields, options)
  else if (options.toEsri) return toEsri(options.projection)
  else return options.projection ? 'SELECT properties, project(geometry, ?) as geometry FROM ?' : 'SELECT * FROM ?'
}

module.exports = { createClause }
