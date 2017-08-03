'use strict'
const Classifier = require('classybrew')
const Options = require('../options')
const Query = require('../query')
const { getFieldValues, normalizeClassBreaks } = require('./normalizeClassBreaks')
const calculateMinValue = require('./utils')

function calculateClassBreaks (features, classification) {
  const values = getFieldValues(features, classification.field)
  // make sure there aren't more breaks than values
  if (classification.breakCount > values.length) classification.breakCount = values.length
  // calculate break ranges [ [a-b], [b-c], ...] from input values
  return classifyClassBreaks(values, features, classification)
    .map((value, index, array) => {
      // change minValue so break ranges don't overlap
      return [calculateMinValue(value, index, array), value]
    }).slice(1) // remove first range
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
    case 'std':
      if (classification.standardDeviationInterval) throw new Error('STD interval not supported')
      return classifier.classify('std_deviation')
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
  options = Options.prepare(options, features)
  const query = Query.create(options)
  return { options, query }
}

module.exports = { calculateClassBreaks, calculateUniqueValueBreaks }
