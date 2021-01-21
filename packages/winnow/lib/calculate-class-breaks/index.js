const _ = require('lodash')
const Classifier = require('classybrew')
const normalizeClassificationValues = require('./normalize-classification-values')
const calculateStdDevIntervals = require('./calculate-std-dev-intervals')
const transformClassBreaksToRanges = require('./transform-class-breaks-to-ranges')

function calculateClassBreaks (features, classification) {
  if (!classification.method) throw new Error('must supply classification.method')
  if (!classification.breakCount) throw new Error('must supply classification.breakCount')

  const values = classification.normType ? normalizeClassificationValues(features, classification) : getFieldValues(features, classification.field)
  // limit break count to num values
  if (classification.breakCount > values.length) classification.breakCount = values.length

  // calculate break ranges [ [a-b], [b-c], ...] from input values
  const classBreakArray = transformValuesToClassBreaksArray(values, classification)
  return transformClassBreaksToRanges(classBreakArray, classification)
}

function transformValuesToClassBreaksArray (values, classification) {
  const {
    breakCount,
    method
  } = classification
  const classifier = new Classifier()
  classifier.setSeries(values)
  classifier.setNumClasses(breakCount)

  switch (classification.method) {
    case 'equalInterval': return classifier.classify('equal_interval')
    case 'naturalBreaks': return classifier.classify('jenks')
    case 'quantile': return classifier.classify('quantile')
    case 'geomInterval': throw new Error('Classification method not yet supported')
    case 'stddev': return calculateStdDevIntervals(values, classification)
    default: throw new Error('invalid classificationMethod: ' + method)
  }
}

function getFieldValues (features, classificationField) {
  const values = features.map(feature => {
    if (shouldSkipFeature({ feature, classificationField })) {
      return
    }

    validateClassificationValue(feature, classificationField)

    const value = feature.properties[classificationField]

    if (value <= 0) {
      return 0
    }
    return value
  }).filter(value => {
    return !_.isUndefined(value)
  })
  if (!values || values.length === 0) {
    throw new Error(`"${classificationField}" was not found on any feature.`)
  }
  return values
}

function shouldSkipFeature ({ feature: { properties }, classificationField }) {
  const value = properties[classificationField]
  return value === undefined || value === null
}

function validateClassificationValue ({ properties }, classificationField) {
  const value = properties[classificationField]
  if (!_.isNumber(value)) {
    throw new TypeError(`Cannot use non-numeric classificationField, ${classificationField}: ${value}`)
  }
}

module.exports = calculateClassBreaks
