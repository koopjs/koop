'use strict'
function getFieldValues (features, field) {
  return features.map((feature, index) => {
    const properties = feature.properties
    const key = Object.keys(properties).filter(property => { return property === field })
    const value = Number(properties[key])
    if (isNaN(value)) throw new TypeError('Cannot use values from unrecognized or non-numeric field')
    return value
  })
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
