const fields = require('./fields')
const aggregates = require('./aggregates')

function createClause (options) {
  if (options.aggregates) return aggregates(options.aggregates, options.groupBy, options.esri)
  else if (options.fields) return fields(options.fields, options)
  else if (options.toEsri) return 'SELECT properties as attributes, esriGeom(geometry) as geometry FROM ?'
  else return 'SELECT * FROM ?'
}

module.exports = { createClause }
