module.exports = function (fields, options) {
  options = options || {}
  if (typeof fields !== 'string') fields = fields.join(',')
  else fields = fields.replace(/,\s+/g, ',')
  let propType
  let geomType
  if (options.toEsri) {
    propType = 'attributes'
    geomType = options.projection ? 'esriGeom(project(geometry, ?)) as geometry' : 'esriGeom(geometry) as geometry'
  } else {
    propType = 'properties'
    geomType = options.projection ? 'project(geometry, ?) as geometry' : 'geometry'
  }

  return `SELECT type, pick(properties, "${fields}") as ${propType}, ${geomType} FROM ?`
}
