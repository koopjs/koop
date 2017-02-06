module.exports = function (fields, options) {
  options = options || {}
  if (typeof fields !== 'string') fields = fields.join(',')
  else fields = fields.replace(/,\s+/g, ',')
  let propType
  let geomType
  if (options.toEsri) {
    propType = 'attributes'
    geomType = 'esriGeom(geometry) as geometry'
  } else {
    propType = 'properties'
    geomType = 'geometry'
  }

  return `SELECT type, pick(properties, "${fields}") as ${propType}, ${geomType} FROM ?`
}
