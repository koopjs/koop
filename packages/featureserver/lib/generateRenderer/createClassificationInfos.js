const _ = require('lodash')
const { createColorRamp } = require('./colorRamps')
const { createSymbol } = require('./createSymbol')

module.exports = { createClassBreakInfos, createUniqueValueInfos }

const renderers = {
  classBreakInfos: require('../../templates/renderers/classification/classBreakInfos.json'),
  uniqueValueInfos: require('../../templates/renderers/classification/uniqueValueInfos.json')
}

function createClassBreakInfos (breaks, classification, geomType) {
  const { colorRamp, baseSymbol } = setSymbology(breaks, classification)

  return breaks.map((currBreak, index) => {
    const json = _.cloneDeep(renderers.classBreakInfos)
    json.classMaxValue = currBreak[1]
    json.classMinValue = currBreak[0]
    json.label = `${json.classMinValue}-${json.classMaxValue}`
    json.description = '' // TODO: ? fill in description
    json.symbol = createSymbol(baseSymbol, colorRamp[index], geomType)
    return json
  })
}

function createUniqueValueInfos (breaks, classification, geomType) {
  const { colorRamp, baseSymbol } = setSymbology(breaks, classification)

  // check that unique value fields are congruous
  if (classification.uniqueValueFields.some(field => {
    return !Object.keys(breaks[0]).includes(field)
  })) {
    throw new Error(
      'Unique value fields are incongruous: ' +
      Object.keys(breaks[0]) +
      classification.uniqueValueFields)
  }

  return breaks.map((currBreak, index) => {
    const json = _.cloneDeep(renderers.uniqueValueInfos)
    json.value = parseUniqueValues(currBreak, classification.fieldDelimiter)
    json.count = currBreak.count
    json.label = json.value
    json.description = '' // TODO: ? fill in description
    json.symbol = createSymbol(baseSymbol, colorRamp[index], geomType)
    return json
  })
}

function parseUniqueValues (currBreak, delimiter) {
  const thisBreak = _.cloneDeep(currBreak)
  delete thisBreak.count
  return Object.keys(thisBreak).map(key => thisBreak[key]).join(delimiter)
}

function setSymbology (breaks, classification) {
  const inputRamp = classification && classification.colorRamp ? classification.colorRamp : undefined
  const colorRamp = createColorRamp(breaks, inputRamp)
  let baseSymbol
  if (classification && classification.baseSymbol) baseSymbol = classification.baseSymbol
  return { colorRamp, baseSymbol }
}
