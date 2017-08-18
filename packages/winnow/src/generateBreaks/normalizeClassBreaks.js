'use strict'
const _ = require('lodash')

function getFieldValues (features, field) {
  if (!(field in features[0].properties)) throw new Error('Classification field missing from first feature: ' + field)
  const values = features.map((feature, index) => {
    const properties = feature.properties
    const key = Object.keys(properties).filter(property => { return property === field })
    let value = properties[key]
    if (value !== null && value !== undefined && value !== '') {
      value = Number(value)
      if (typeof value !== 'number') throw new TypeError('Cannot use values from non-numeric field: ' + value)
      return value
    }
  })
  return _.without(values, null, undefined, '')
}

function normalizeClassBreaks (values, features, classification) {
  switch (classification.normType) {
    case 'field': return normalizeByField(values, features, classification)
    case 'log': return normalizeByLog(values)
    case 'percent': return normalizeByPercent(values)
    default: throw new Error('Normalization not supported: ' + classification.normType)
  }
}

function normalizeByField (values, features, classification) {
  if (classification.normField) {
    const normValues = getFieldValues(features, classification.normField)
    if (Array.isArray(normValues)) return divideByField(values, normValues)
    else throw new Error('Normalization values must be an array: ' + normValues)
  } else throw new Error('invalid normalization field: ' + classification.normField)
}

function divideByField (values, normValues) {
  return values.map((value, index) => {
    if (isNaN(normValues[index])) throw new Error('Field value to normalize with is non-numeric')
    return value / (normValues[index] <= 0 ? 1 : normValues[index]) // do not divide by <= 0
  })
}

function normalizeByLog (values) {
  return values.map(value => {
    return value === 0 || Math.log(value) <= 0 ? 0 : (Math.log(value) * Math.LOG10E || 0)
  })
}

function normalizeByPercent (values) {
  let valueTotal = values.reduce((sum, value) => { return sum + value }, 0)
  if (valueTotal <= 0) throw new Error('Value total is not positive: ' + valueTotal)
  return values.map(value => { return (value / valueTotal) * 100 })
}

module.exports = { getFieldValues, normalizeClassBreaks }
