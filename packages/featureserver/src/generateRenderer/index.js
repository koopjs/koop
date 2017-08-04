const Winnow = require('winnow')
const { getGeom } = require('./getGeom')
const { renderClassBreaks, renderUniqueValue } = require('../templates')

module.exports = generateRenderer

/**
 * processes params based on generate renderer params
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function generateRenderer (data = {}, params = {}) {
  if (Object.keys(data).length === 0) throw new Error('there must be input features in order to generate a renderer')

  let breaks = []
  if (data.statistics && data.statistics.classBreaks) {
    breaks = data.statistics.classBreaks.sort((a, b) => a - b)
    return renderClassBreaks(breaks, {}, '')
  } else if (data.features) breaks = Winnow.query(data, params)
  else throw new Error('Must supply statistics or data features')
  // TODO: ? handle uniqueValue statistics

  if (params.classificationDef && params.classificationDef.type) {
    const geomType = getGeom(data, params)
    const classification = params.classificationDef
    if (classification.type && classification.type === 'classBreaksDef') {
      return renderClassBreaks(breaks, classification, geomType)
    } else if (classification.type && classification.type === 'uniqueValueDef') {
      return renderUniqueValue(breaks, classification, geomType)
    } else { throw new Error('invalid classification type: ', classification.type) }
  } else { throw new Error('invalid classification: ', params.classificationDef) }
}
