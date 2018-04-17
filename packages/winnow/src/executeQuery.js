'use strict'
const farmhash = require('farmhash')
const sql = require('./sql')
const Query = require('./query')
const { calculateClassBreaks, calculateUniqueValueBreaks } = require('./generateBreaks/index')
const _ = require('lodash')

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

function limitQuery (features, query, options) {
  let filtered = []
  let limitExceeded = false
  if (options.offset) {
    if (options.offset >= features.length) throw new Error('OFFSET >= features length: ' + options)
    options.limit += options.offset
  }
  features.some((feature) => {
    const result = processQuery(feature, query, options)
    if (result) filtered.push(result)
    if (filtered.length === (options.limit + 1)) {
      limitExceeded = true
      return true
    }
  })

  if (limitExceeded) filtered = filtered.slice(0, -1)

  if (options.collection) {
    options.collection.metadata = Object.assign({}, options.collection.metadata, { limitExceeded })
  }

  return finishQuery(filtered, options)
}

function standardQuery (features, query, options) {
  const filtered = features.reduce((filteredFeatures, feature) => {
    const result = processQuery(feature, query, options)
    if (result) filteredFeatures.push(result)
    return filteredFeatures
  }, [])
  return finishQuery(filtered, options)
}

function processQuery (feature, query, options) {
  const params = Query.params([feature], options)
  const result = sql(query, params)[0]

  if (result && options.toEsri) return esriFy(result, feature, options)
  else return result
}

function esriFy (result, feature, options) {
  if (options.dateFields.length) {
    // mutating dates has down stream consequences if the data is reused
    result.attributes = _.cloneDeep(result.attributes)
    options.dateFields.forEach(field => {
      result.attributes[field] = new Date(result.attributes[field]).getTime()
    })
  }

  const idField = _.get(options, 'collection.metadata.idField')

  // If the idField for the model set and is not already called OBJECTID, use its value as OBJECTID
  if (idField) result.attributes.OBJECTID = result.attributes[idField]
  else {
    // Create an OBJECTID by creating a numeric hash from the stringified feature
    // Note possibility of OBJECTID collisions with this method still exists, but should be small
    result.attributes.OBJECTID = createIntHash(JSON.stringify(feature))
  }
  return result
}

function finishQuery (features, options) {
  if (options.offset) {
    if (options.offset >= features.length) throw new Error('OFFSET >= features length: ' + options)
    features = features.slice(options.offset)
  }
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

/**
 * Create integer hash in range of 0 - 2147483647 from string 
 * @param {*} inputStr - any string 
 */
function createIntHash (inputStr) {
  // Hash to 32 bit unsigned integer
  const hash = farmhash.hash32(inputStr)
  // Normalize to range of postive values of signed integer
  return Math.round((hash / 4294967295) * (2147483647))
}

module.exports = { breaksQuery, aggregateQuery, limitQuery, standardQuery, finishQuery }
