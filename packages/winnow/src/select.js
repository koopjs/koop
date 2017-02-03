function createClause (options) {
  if (options.aggregates) return aggSelect(options.aggregates, options.groupBy, options.esri)
  else if (options.outStatistics) return outStatSelect(options.outStatistics, options.groupByFieldsForStatistics, options.toEsri)
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
  if (groupBy) return addGroupBy(select, groupBy, selector)
  else return `${select.slice(0, -1)} FROM ?`
}

function addGroupBy (select, groupBy, selector) {
  groupBy = normalizeGroupBy(groupBy)
  const groups = groupBy.reduce((fragment, group) => {
    return `${fragment} ${selector}->\`${group}\`,`
  }, '').slice(0, -1)

  const fields = groupBy.reduce((fragment, group) => {
    return `${fragment} ${selector}->\`${group}\` as \`${group}\`,`
  }, '').slice(0, -1)

  return `${select.slice(0, -1)}, ${fields} FROM ? GROUP BY ${groups}`
}

function normalizeGroupBy (groupBy) {
  return typeof groupBy === 'string' ? [groupBy] : groupBy
}

function outStatSelect (outStats, groupBy, esri) {
  if (typeof outStats === 'string') outStats = JSON.parse(outStats)
  const aggregates = outStats.map((agg) => {
    return {
      type: agg.statisticType,
      field: agg.onStatisticField,
      name: agg.outStatisticFieldName
    }
  })
  return aggSelect(aggregates, groupBy, esri)
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
