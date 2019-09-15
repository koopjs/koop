/* global describe, it, beforeEach */
const _ = require('lodash')
// const assert = require('assert')
const snow = require('./fixtures/snow.json')
const treesSubset = require('./fixtures/treesSubset.json')
const generateRenderer = require('../src/generateRenderer')
const { createClassBreakInfos, createUniqueValueInfos } = require('../src/generateRenderer/createClassificationInfos')
const { createColorRamp } = require('../src/generateRenderer/colorRamps')

const inputBreaks = require('./fixtures/generateRenderer/inputBreaks.json')
const algorithmicRamp = require('./fixtures/generateRenderer/ramp-algorithmic.json')
const multipartRamp = require('./fixtures/generateRenderer/ramp-multipart.json')
const classBreaksDef = require('./fixtures/generateRenderer/classBreaksDef.json')
const uniqueValueDef = require('./fixtures/generateRenderer/uniqueValueDef')
const classBreakInfos = require('./fixtures/generateRenderer/classBreakInfos.json')
const uniqueValueInfos = require('./fixtures/generateRenderer/uniqueValueInfos.json')
const ProviderStatsClassBreaks = require('./fixtures/generateRenderer/provider-statistics-with-classBreaks.json')

describe('when a class breaks classification passed in', () => {
  let data
  let options
  beforeEach(() => {
    data = _.cloneDeep(snow)
    options = _.cloneDeep(classBreaksDef)
  })
  describe('with statistics', () => {
    beforeEach(() => {
      data = _.cloneDeep(ProviderStatsClassBreaks)
    })
    describe('do not exist', () => {
      it('should throw an error', () => {
        const options = {}
        data.statistics = []
        generateRenderer.bind(this, data, options).should.throw()
      })
    })
    it('should properly return a renderer', () => {
      const options = {}
      const response = generateRenderer(data, options)
      response.minValue.should.equal(80)
      response.classBreakInfos.length.should.equal(9)
      response.classBreakInfos[0].label.should.equal('80-147')
      response.classBreakInfos[0].symbol.color.should.deepEqual([0, 255, 0])
      response.classBreakInfos[4].symbol.color.should.deepEqual([0, 255, 255])
      response.classBreakInfos[8].symbol.color.should.deepEqual([0, 0, 255])
      response.classBreakInfos[0].symbol.type.should.equal('esriSMS')
    })
  })
  describe('does not exist', () => {
    it('should throw an error', () => {
      options = {}
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('with no input data', () => {
    it('should throw and error', () => {
      data = {}
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('returns no queried features', () => {
    it('should throw and error', () => {
      options.where = 'latitude>1000'
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('with geometry', () => {
    describe('that is incongruous', () => {
      it('should throw an error', () => {
        options.classificationDef.baseSymbol.type = 'esriSLS'
        generateRenderer.bind(this, data, options).should.throw()
      })
    })
    describe('that is invalid', () => {
      it('should throw an error', () => {
        const modifiedData = _.cloneDeep(data)
        modifiedData.features = modifiedData.features.map((feature) => {
          feature.geometry.type = 'Invalid Type'
          return feature
        })
        delete options.classificationDef.baseSymbol
        generateRenderer.bind(this, modifiedData, options).should.throw()
      })
    })
  })
  describe('has correct parameters', () => {
    it('should properly return a renderer', () => {
      const response = generateRenderer(data, options)
      response.type.should.equal('classBreaks')
      response.minValue.should.equal(0)
      response.classBreakInfos.length.should.equal(9)
      response.classBreakInfos[0].classMinValue.should.equal(0)
      response.classBreakInfos[0].label.should.equal('0-1.4555555555555555')
      response.classBreakInfos[0].symbol.color.should.deepEqual([115, 76, 0])
      response.classBreakInfos[4].symbol.color.should.deepEqual([198, 39, 0])
      response.classBreakInfos[8].symbol.color.should.deepEqual([255, 25, 86])
      response.classBreakInfos[0].symbol.type.should.equal('esriSMS')
    })
    it('should use a default symbol and color ramp', () => {
      delete options.classificationDef.baseSymbol
      delete options.classificationDef.colorRamp
      const response = generateRenderer(data, options)
      response.type.should.equal('classBreaks')
      response.minValue.should.equal(0)
      response.classBreakInfos.length.should.equal(9)
      response.classBreakInfos[0].classMinValue.should.equal(0)
      response.classBreakInfos[0].label.should.equal('0-1.4555555555555555')
      response.classBreakInfos[0].symbol.color.should.deepEqual([0, 255, 0])
      response.classBreakInfos[4].symbol.color.should.deepEqual([0, 255, 255])
      response.classBreakInfos[8].symbol.color.should.deepEqual([0, 0, 255])
      response.classBreakInfos[0].symbol.type.should.equal('esriSMS')
    })
    describe('has normalization', () => {
      it('should properly return log normalized values', () => {
        options.classificationDef.normalizationType = 'esriNormalizeByLog'
        const response = generateRenderer(data, options)
        response.type.should.equal('classBreaks')
        response.minValue.should.equal(0)
        response.classBreakInfos.length.should.equal(9)
        response.classBreakInfos[0].classMinValue.should.equal(0)
        response.classBreakInfos[0].label.should.equal('0-0.1241412550728627')
      })
    })
  })
})

describe('when a unique value classification passed in', () => {
  let data
  let options
  beforeEach(() => {
    data = _.cloneDeep(treesSubset)
    options = _.cloneDeep(uniqueValueDef)
  })
  // TODO: determine if unique value statistics can be passed in
  describe('does not exist', () => {
    it('should throw an error', () => {
      options = {}
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('with no input data', () => {
    it('should throw and error', () => {
      data = {}
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('returns no queried features', () => {
    it('should throw and error', () => {
      options.where = 'latitude>1000'
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('has incongruous geometry', () => {
    it('should throw an error', () => {
      options.classificationDef.baseSymbol.type = 'esriSLS'
      generateRenderer.bind(this, data, options).should.throw()
    })
  })
  describe('with geometry', () => {
    describe('that is incongruous', () => {
      it('should throw an error', () => {
        options.classificationDef.baseSymbol.type = 'esriSLS'
        generateRenderer.bind(this, data, options).should.throw()
      })
    })
    describe('that is invalid', () => {
      it('should throw an error', () => {
        const modifiedData = _.cloneDeep(data)
        modifiedData.features = modifiedData.features.map((feature) => {
          feature.geometry.type = 'Invalid Type'
          return feature
        })
        delete options.classificationDef.baseSymbol
        generateRenderer.bind(this, modifiedData, options).should.throw()
      })
    })
  })
  describe('has correct parameters', () => {
    it('should properly return a renderer', () => {
      const response = generateRenderer(data, options)
      response.type.should.equal('uniqueValue')
      response.field1.should.equal('Genus')
      response.fieldDelimiter.should.equal(', ')
      response.uniqueValueInfos.length.should.equal(42)
      response.uniqueValueInfos[0].value.should.equal('MAGNOLIA')
      response.uniqueValueInfos[0].count.should.equal(80)
      response.uniqueValueInfos[0].label.should.equal('MAGNOLIA')
      response.uniqueValueInfos[0].symbol.color.should.deepEqual([115, 76, 0])
      response.uniqueValueInfos[20].symbol.color.should.deepEqual([195, 41, 0])
      response.uniqueValueInfos[41].symbol.color.should.deepEqual([255, 25, 86])
      response.uniqueValueInfos[0].symbol.type.should.equal('esriSMS')
    })
    it('should use a default symbol and color ramp', () => {
      delete options.classificationDef.baseSymbol
      delete options.classificationDef.colorRamp
      const response = generateRenderer(data, options)
      response.type.should.equal('uniqueValue')
      response.field1.should.equal('Genus')
      response.fieldDelimiter.should.equal(', ')
      response.uniqueValueInfos.length.should.equal(42)
      response.uniqueValueInfos[0].value.should.equal('MAGNOLIA')
      response.uniqueValueInfos[0].count.should.equal(80)
      response.uniqueValueInfos[0].label.should.equal('MAGNOLIA')
      response.uniqueValueInfos[0].symbol.color.should.deepEqual([0, 255, 0])
      response.uniqueValueInfos[20].symbol.color.should.deepEqual([0, 255, 249])
      response.uniqueValueInfos[41].symbol.color.should.deepEqual([0, 0, 255])
      response.uniqueValueInfos[0].symbol.type.should.equal('esriSMS')
    })
    describe('has multiple unique value fields', () => {
      it('should properly return multi-word value string', () => {
        options.classificationDef.uniqueValueFields.push('Common_Name')
        const response = generateRenderer(data, options)
        response.type.should.equal('uniqueValue')
        response.field1.should.equal('Genus')
        response.fieldDelimiter.should.equal(', ')
        response.uniqueValueInfos.length.should.equal(48)
        response.uniqueValueInfos[0].value.should.equal('MAGNOLIA, SOUTHERN MAGNOLIA')
        response.uniqueValueInfos[0].count.should.equal(80)
        response.uniqueValueInfos[0].label.should.equal('MAGNOLIA, SOUTHERN MAGNOLIA')
        response.uniqueValueInfos[0].symbol.color.should.deepEqual([115, 76, 0])
        response.uniqueValueInfos[23].symbol.color.should.deepEqual([196, 41, 0])
        response.uniqueValueInfos[47].symbol.color.should.deepEqual([255, 25, 86])
        response.uniqueValueInfos[0].symbol.type.should.equal('esriSMS')
      })
    })
  })
})
describe('when creating class break infos', () => {
  it('should properly return class break infos', () => {
    const options = _.cloneDeep(classBreakInfos)
    const classification = options.params.classificationDef
    const classBreaks = options.classBreaks
    const response = createClassBreakInfos(classBreaks, classification)
    response.length.should.equal(9)
    response[0].classMinValue.should.equal(0)
    response[0].label.should.equal('0-0.1241412550728627')
    response[0].symbol.color.should.deepEqual([115, 76, 0])
    response[4].symbol.color.should.deepEqual([198, 39, 0])
    response[8].symbol.color.should.deepEqual([255, 25, 86])
  })
})
describe('when creating unique value infos', () => {
  it('should properly return unqiue value infos', () => {
    const options = _.cloneDeep(uniqueValueInfos)
    const classification = options.params.classificationDef
    const uniqueBreaks = options.uniqueValue
    const response = createUniqueValueInfos(uniqueBreaks, classification)
    response.length.should.equal(5)
    response[0].symbol.color.should.deepEqual([115, 76, 0])
    response[2].symbol.color.should.deepEqual([198, 39, 0])
    response[4].symbol.color.should.deepEqual([255, 25, 86])
  })
})
describe('when creating a color ramp that', () => {
  describe('is algorithmic', () => {
    let breaks
    let inputRamp
    beforeEach(() => {
      breaks = _.cloneDeep(inputBreaks)
      inputRamp = _.cloneDeep(algorithmicRamp)
    })
    describe('has no break count', () => {
      it('should throw an error', () => {
        createColorRamp.bind(this, undefined, inputRamp).should.throw()
      })
    })
    describe('using the HSV algorithm', () => {
      it('should return correct hsv color ramp', () => {
        const response = createColorRamp(breaks, inputRamp)
        response.should.be.an.instanceOf(Array)
        response.length.should.equal(9)
        response[3].should.be.an.instanceOf(Array)
        response[3].length.should.equal(3)
        response[3].should.deepEqual([0, 255, 191])
      })
      it('should return correct number of breaks', () => {
        breaks.push([2001, 3000])
        const response = createColorRamp(breaks, inputRamp)
        response.length.should.equal(10)
      })
      it('should change ramp colors when fromColor & toColor are changed', () => {
        inputRamp.fromColor = [115, 76, 0]
        inputRamp.toColor = [255, 25, 86]
        const response = createColorRamp(breaks, inputRamp)
        response[0].should.deepEqual([115, 76, 0])
        response[4].should.deepEqual([198, 39, 0])
        response[8].should.deepEqual([255, 25, 86])
      })
    })
    describe('using the LAB algorithm', () => {
      beforeEach(() => {
        inputRamp.algorithm = 'esriCIELabAlgorithm'
      })
      it('should return correct lab color ramp', () => {
        const response = createColorRamp(breaks, inputRamp)
        response.should.be.an.instanceOf(Array)
        response.length.should.equal(9)
        response[3].should.be.an.instanceOf(Array)
        response[3].length.should.equal(3)
        response[3].should.deepEqual([123, 174, 141])
      })
      it('should return correct number of breaks', () => {
        breaks.push([2001, 3000])
        const response = createColorRamp(breaks, inputRamp)
        response.length.should.equal(10)
      })
      it('should change ramp colors when toColor is changed', () => {
        inputRamp.toColor = [50, 173, 23]
        const response = createColorRamp(breaks, inputRamp)
        response[3].should.deepEqual([35, 224, 14])
      })
    })
    describe('using the LCH algorithm', () => {
      beforeEach(() => {
        inputRamp.algorithm = 'esriLabLChAlgorithm'
      })
      it('should return correct lch color ramp', () => {
        const response = createColorRamp(breaks, inputRamp)
        response.should.be.an.instanceOf(Array)
        response.length.should.equal(9)
        response[3].should.be.an.instanceOf(Array)
        response[3].length.should.equal(3)
        response[3].should.deepEqual([0, 206, 237])
      })
      it('should return correct number of breaks', () => {
        breaks.push([2001, 3000])
        const response = createColorRamp(breaks, inputRamp)
        response.length.should.equal(10)
      })
      it('should change ramp colors when toColor is changed', () => {
        inputRamp.toColor = [50, 173, 23]
        const response = createColorRamp(breaks, inputRamp)
        response[3].should.deepEqual([37, 224, 13])
      })
    })
  })
  describe('multipart', () => {
    let breaks
    let inputRamp
    beforeEach(() => {
      breaks = _.cloneDeep(inputBreaks)
      inputRamp = _.cloneDeep(multipartRamp)
    })
    it('should return multiple color ramps', () => {
      const response = createColorRamp(breaks, inputRamp)
      response.should.be.an.instanceOf(Array)
      response.length.should.equal(3)
    })
    it('should return correct color ramps that have different algorithms', () => {
      const response = createColorRamp(breaks, inputRamp)
      response[2].should.be.an.instanceOf(Array)
      response[2].length.should.equal(9)
      response[0][7].should.deepEqual([0, 64, 255])
      response[1][7].should.deepEqual([83, 58, 233])
      response[0].length.should.equal(response[1].length)
      response[1].length.should.equal(response[2].length) // TODO: ? allow different breakCounts for each ramp
    })
  })
})
