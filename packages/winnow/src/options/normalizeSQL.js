function normalizeWhere (options) {
  if (/1\s*=\s*1/.test(options.where)) return undefined
  else if (/(?!date )('?\d\d\d\d-\d\d-\d\d'?)/.test(options.where)) return normalizeDate(options.where)
  else return options.where
}

function normalizeDate (where) {
  const matches = where.match(/(?!date )('?\d\d\d\d-\d\d-\d\d'?)/g)
  matches.forEach(match => {
    where = where.replace(`date ${match}`, `'${new Date(match.toString()).toISOString()}'`)
  })
  return where
}

function normalizeFields (options) {
  const fields = options.fields || options.outFields
  if (fields === '*') return undefined
  return typeof fields === 'string' ? [fields] : fields
}

function normalizeOrder (options) {
  const order = options.order || options.orderByFields
  return typeof order === 'string' ? [order] : order
}

function normalizeAggregates (options) {
  let aggregates = options.aggregates
  if (options.outStatistics) {
    aggregates = options.outStatistics.map(agg => {
      return {
        type: agg.statisticType,
        field: agg.onStatisticField,
        name: agg.outStatisticFieldName
      }
    })
  }

  if (aggregates) {
    aggregates.forEach(agg => {
      if (!agg.name) agg.name = `${agg.type}_${agg.field}`
      agg.name = agg.name.replace(/\s/g, '_')
    })
  }

  return aggregates
}

function normalizeGroupBy (options) {
  const groupBy = options.groupBy || options.groupByFieldsForStatistics
  return typeof groupBy === 'string' ? [groupBy] : groupBy
}

module.exports = { normalizeWhere, normalizeFields, normalizeOrder, normalizeAggregates, normalizeGroupBy }
