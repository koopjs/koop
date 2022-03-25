const _ = require('lodash')
const { createClassBreakInfos, createUniqueValueInfos } = require('./generateRenderer/createClassificationInfos')
module.exports = { renderClassBreaks, renderUniqueValue }

const renderers = {
  classBreaks: require('../templates/renderers/classification/classBreaks.json'),
  uniqueValue: require('../templates/renderers/classification/uniqueValue.json')
}

/**
 * Modifies a template layer json file with metadata, capabilities, and data from the model
 * @param {object} data - data from provider model
 * @param {object} options
 * @return {object} layer info
 */

function renderClassBreaks (breaks, classificationDef, geomType) {
  if (!Array.isArray(breaks) || !Array.isArray(breaks[0])) throw new Error('Breaks must be an array of break ranges')
  const json = _.cloneDeep(renderers.classBreaks)
  if (classificationDef) {
    json.field = classificationDef.classificationField
    json.classificationMethod = classificationDef.classificationMethod
  }
  json.minValue = breaks[0][0] // lower bound of first class break
  json.classBreakInfos = createClassBreakInfos(breaks, classificationDef, geomType)
  return json
}

function renderUniqueValue (breaks, classificationDef, geomType) {
  const json = _.cloneDeep(renderers.uniqueValue)
  json.field1 = classificationDef.uniqueValueFields[0]
  json.fieldDelimiter = classificationDef.fieldDelimiter
  json.uniqueValueInfos = createUniqueValueInfos(breaks, classificationDef, geomType)
  return json
}
