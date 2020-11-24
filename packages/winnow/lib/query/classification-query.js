const standardQuery = require('./standard-query')
const { calculateClassBreaks, calculateUniqueValueBreaks } = require('../generateBreaks/index')

function classificationQuery (features, sqlstatement, options) {
  const { features: filtered } = standardQuery(features, sqlstatement, options)
  validateQueryResult(filtered)

  const { classification } = options
  const { breakCount, type } = classification

  if (type === 'classes') {
    if (breakCount <= 0) throw new Error('breakCount must be positive: ' + breakCount)
    return calculateClassBreaks(filtered, classification)
  }

  if (type === 'unique') {
    const { options, query: sqlBreaksStatement } = calculateUniqueValueBreaks(filtered, classification)
    return standardQuery(filtered, sqlBreaksStatement, { ...options, skipLimitHandling: true })
  }

  throw new Error(`unacceptable classification type: ${type}`)
}

function validateQueryResult (features) {
  if (features === undefined) throw new Error('query results include undefined features')
  if (features.length === 0) throw new Error('query results in zero features; features needed in order to classify')
}

module.exports = classificationQuery
