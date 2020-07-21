'use strict'
const Classifier = require('classybrew')
const normalizeQueryOptions = require('../normalize-query-options')
const Query = require('../sql-query')
const { getFieldValues, normalizeClassBreaks } = require('./normalizeClassBreaks')
const { adjustIntervalValue, calculateStdDevIntervals } = require('./utils')

function calculateClassBreaks (features, classification) {
  if (!classification.method) throw new Error('must supply classification.method')
  if (!classification.breakCount) throw new Error('must supply classification.breakCount')

  const isStdDev = classification.method === 'stddev'
  const values = getFieldValues(features, classification.field)
  // limit break count to num values
  if (classification.breakCount > values.length) classification.breakCount = values.length

  // calculate break ranges [ [a-b], [b-c], ...] from input values
  return classifyClassBreaks(values, features, classification)
    .map((value, index, array) => {
      // adjust min or max interval value so break ranges don't overlap [ [0-1], [1.1-2], ...]
      return adjustIntervalValue(value, index, array, isStdDev)
    })
    .slice(isStdDev ? 0 : 1) // if not stddev classification, remove first interval
    .filter((currBreak) => { return currBreak !== null }) // remove null breaks within stddev classification
}

function classifyClassBreaks (values, features, classification) {
  if (classification.normType) values = normalizeClassBreaks(values, features, classification)
  const classifier = new Classifier()
  classifier.setSeries(values)
  classifier.setNumClasses(classification.breakCount)

  switch (classification.method) {
    case 'equalInterval': return classifier.classify('equal_interval')
    case 'naturalBreaks': return classifier.classify('jenks')
    case 'quantile': return classifier.classify('quantile')
    case 'geomInterval': throw new Error('Classification method not yet supported')
    case 'stddev': return calculateStdDevIntervals(values, classification)
    default: throw new Error('invalid classificationMethod: ' + classification.method)
  }
}

function calculateUniqueValueBreaks (features, classification) {
  if (classification.fields.length > 3) throw new Error('Cannot classify using more than three fields')
  classification.fields.map(field => {
    if (!features[0].properties[field]) throw new Error('Unknown field: ' + field)
  })

  let options = {
    aggregates: [
      {
        type: 'count',
        field: classification.fields[0], // arbitrary field choice
        name: 'count'
      }
    ],
    groupBy: classification.fields
  }
  options = normalizeQueryOptions(options, features)
  const query = Query.create(options)
  return { options, query }
}

module.exports = { calculateClassBreaks, calculateUniqueValueBreaks }
