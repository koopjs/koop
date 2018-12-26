'use strict'
const sql = require('./sql')
const Query = require('./query')
const { calculateClassBreaks, calculateUniqueValueBreaks } = require('./generateBreaks/index')

function breaksQuery (features, query, options) {
  const queriedData = standardQuery(features, query, options)
  if (queriedData === undefined || queriedData.features === undefined) throw new Error('query response undefined')
  if (queriedData.features.length === 0) throw new Error('need features in order to classify')

  const classification = options.classification
  if (classification.type === 'classes') {
    if (classification.breakCount <= 0) throw new Error('breakCount must be positive: ' + classification.breakCount)
    return calculateClassBreaks(queriedData.features, classification)
  } else if (classification.type === 'unique') {
    const { options, query } = calculateUniqueValueBreaks(queriedData.features, classification)
    return aggregateQuery(queriedData.features, query, options)
  } else throw new Error('unacceptable classification type: ' + classification.type)
}

function aggregateQuery (features, query, options) {
  const params = Query.params(features, options)
  const filtered = sql(query, params)
  return finishQuery(filtered, options)
}

function standardQuery (features, query, options) {
  const params = Query.params(features, options)
  let filtered = sql(query, params)

  // Handling for limit queries; limit arrives as options "limit", "resultRecordCount", "count" or "maxFeatures
  if (options.limit) {
    let limitExceeded = false
    // options.limit is incremented by one in normalizeOptions.js; so if filtered.length === options.limit, we know
    // the original limit option has been exceeded
    if (filtered.length === options.limit) {
      limitExceeded = true
      // Now slice off the last feature, so that our feature array length is consistent with origin option
      filtered = filtered.slice(0, -1)
    }
    if (options.collection) options.collection.metadata = Object.assign({}, options.collection.metadata, { limitExceeded })
  }
  return finishQuery(filtered, options)
}

function finishQuery (features, options) {
  if (options.groupBy) {
    return features
  } else if (options.aggregates) {
    return features[0]
  } else if (options.collection) {
    const collection = options.collection
    collection.features = features
    return collection
  } else {
    return features
  }
}

module.exports = { breaksQuery, aggregateQuery, standardQuery, finishQuery }
