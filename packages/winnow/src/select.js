function createClause (options) {
  if (options.aggregates) return aggSelect(options.aggregates, options.groupBy, options.toEsri)
  else if (options.outStatistics) return outStatSelect(options.outStatistics)
  else if (options.fields) return fieldSelect(options.fields, options)
  else if (options.toEsri) return 'SELECT properties as attributes, esriGeom(geometry) as geometry FROM ?'
  else return 'SELECT * FROM ?'
}

function aggSelect (aggregates, groupBy, esri) {
  const selector = esri ? 'attributes' : 'properties'
  const select = aggregates.reduce((sql, agg) => {
    const name = agg.name || `${agg.type}_${agg.field}`.replace(/\s/g, '_')
    let func
    if (agg.options) {
      func = `${agg.type.toUpperCase()}(${selector}->\`${agg.field}\`, ${agg.options})`
    } else {
      func = `${agg.type.toUpperCase()}(${selector}->\`${agg.field}\`)`
    }
    return `${sql} ${func} as \`${name}\`,`
  }, 'SELECT')
  if (groupBy) {
    const gb = `${selector}->\`${groupBy}\``
    return `${select.slice(0, -1)}, ${gb} as ${groupBy} FROM ? GROUP BY ${gb}`
  } else {
    return `${select.slice(0, -1)} FROM ?`
  }
}

function outStatSelect (outStats) {
  if (typeof outStats === 'string') outStats = JSON.parse(outStats)
  const aggregates = outStats.map((agg) => {
    return {
      type: agg.statisticType,
      field: agg.onStatisticField,
      name: agg.outStatisticFieldName
    }
  })
  return aggSelect(aggregates)
}

function fieldSelect (fields, options) {
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

module.exports = { createClause }
