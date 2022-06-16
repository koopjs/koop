const {
  createClassBreakInfos,
  createUniqueValueInfos
} = require('./createClassificationInfos')
const Winnow = require('winnow')
const { getGeom } = require('./getGeom')

module.exports = generateRenderer

/**
 * processes params based on generate renderer params
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function generateRenderer (data = {}, params = {}) {
  const {
    statistics = {},
    features
  } = data

  if (statistics.classBreaks) {
    const breaks = statistics.classBreaks.sort((a, b) => a - b)
    return renderClassBreaks(breaks, {}, '')
  }

  if (features) {
    return generateRendererFromFeatures(data, params)
  }

  return {}
}

function generateRendererFromFeatures (data, params) {
  const { classificationDef = {} } = params
  const breaks = Winnow.query(data, params)

  if (classificationDef.type) {
    const geomType = getGeom(data, params)

    if (classificationDef.type === 'classBreaksDef') {
      return renderClassBreaks(breaks, classificationDef, geomType)
    }

    if (classificationDef.type === 'uniqueValueDef') {
      return renderUniqueValue(breaks, classificationDef, geomType)
    }

    throw new Error('invalid classification type: ', classificationDef.type)
  }

  throw new Error('invalid classification: ', classificationDef)
}

function renderClassBreaks (breaks, classificationDef, geomType) {
  if (!Array.isArray(breaks) || !Array.isArray(breaks[0])) {
    throw new Error('Breaks must be an array of break ranges')
  }

  return {
    type: 'classBreaks',
    field: classificationDef.classificationField || '',
    classificationMethod: classificationDef.classificationMethod || '',
    minValue: breaks[0][0],
    classBreakInfos: createClassBreakInfos(breaks, classificationDef, geomType)
  }
}

function renderUniqueValue (breaks, classificationDef, geomType) {
  return {
    type: 'uniqueValue',
    field1: classificationDef.uniqueValueFields[0],
    field2: '',
    field3: '',
    fieldDelimiter: classificationDef.fieldDelimiter,
    defaultSymbol: {},
    defaultLabel: '',
    uniqueValueInfos: createUniqueValueInfos(breaks, classificationDef, geomType)
  }
}
