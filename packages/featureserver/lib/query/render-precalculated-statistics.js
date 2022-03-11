const _ = require('lodash')
const { isValidISODateString, isValidDate } = require('iso-datestring-validator')
const { computeFieldObject } = require('../field')

function renderPrecalculatedStatisticsResponse (input) {
  const {
    statistics,
    metadata
  } = input

  const normalizedStatistics = Array.isArray(statistics) ? statistics : [statistics]
  const fields = metadata ? computeFieldObject(input) : createFieldDefinitions(normalizedStatistics)
  const fieldAliases = _.chain(fields).map(field => field.name).keyBy(key => key).value()

  return {
    displayFieldName: '',
    fieldAliases,
    fields,
    features: createStatisticFeatures(normalizedStatistics)
  }
}

function createStatisticFeatures (statistics) {
  return statistics.map(statistic => {
    return {
      attributes: convertDatePropertiesToTimestamps(statistic)
    }
  })
}

function convertDatePropertiesToTimestamps (obj) {
  return _.mapValues(obj, value => {
    if (isDate(value)) {
      return new Date(value).getTime()
    }
    return value
  })
}

// TODO: replace after we refactor computeFieldObject
function createFieldDefinitions (statisticRecords) {
  return _.chain(statisticRecords)
    .map(Object.entries)
    .flatten()
    .uniqBy(([key]) => {
      return key
    })
    .map(([key, value]) => {
      const type = detectType(value)

      const retVal = {
        name: key,
        type,
        alias: key
      }

      if (type === 'esriFieldTypeString') {
        retVal.length = 254
      }

      return retVal
    })
    .value()
}

function detectType (value) {
  if (isDate(value)) {
    return 'esriFieldTypeDate'
  }

  if (typeof value === 'string') {
    return 'esriFieldTypeString'
  }

  if (typeof value === 'number') {
    return 'esriFieldTypeDouble'
  }

  return null
}

function isDate (value) {
  return value instanceof Date || ((typeof value === 'string') && (isValidDate(value) || isValidISODateString(value)))
}

module.exports = { renderPrecalculatedStatisticsResponse }
