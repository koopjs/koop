const should = require('should') // eslint-disable-line
should.config.checkProtoEql = false
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('layers metadata', () => {
  it('empty input returns empty table and layer arrays', () => {
    const normalizeInputData = sinon.spy(function () {
      return {
        layers: [],
        tables: []
      }
    })
    const TableLayerMetadata = sinon.spy()
    const FeatureLayerMetadata = sinon.spy()

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
      './helpers': {
        normalizeInputData,
        TableLayerMetadata,
        FeatureLayerMetadata
      }
    })

    const layersInfo = layersInfoHandler({})

    layersInfo.should.deepEqual({
      layers: [],
      tables: []
    })

    normalizeInputData.callCount.should.equal(1)
    normalizeInputData.firstCall.args.should.deepEqual([{}])
    TableLayerMetadata.callCount.should.equal(0)
    FeatureLayerMetadata.callCount.should.equal(0)
  })

  it('table/feature layer input should generate appropriate class instances with default ids', () => {
    const normalizeInputData = sinon.spy(function () {
      return {
        layers: ['layer1', 'layer2'],
        tables: ['table1']
      }
    })

    const tableCreateSpy = sinon.spy()
    const TableLayerMetadata = class TableClass {
      static create (input, options) {
        tableCreateSpy(input, options)
        return `${input}-metadata`
      }
    }

    const featureLayerCreateSpy = sinon.spy()
    const FeatureLayerMetadata = class FeatureClass {
      static create (input, options) {
        featureLayerCreateSpy(input, options)
        return `${input}-metadata`
      }
    }

    const layersInfoHandler = proxyquire('../../lib/layers-metadata', {
      './helpers': {
        normalizeInputData,
        TableLayerMetadata,
        FeatureLayerMetadata
      }
    })

    const layersInfo = layersInfoHandler({ hello: 'world' }, { some: 'options' })

    layersInfo.should.deepEqual({
      layers: ['layer1-metadata', 'layer2-metadata'],
      tables: ['table1-metadata']
    })

    normalizeInputData.callCount.should.equal(1)
    normalizeInputData.firstCall.args.should.deepEqual([{ hello: 'world' }])
    featureLayerCreateSpy.callCount.should.equal(2)
    featureLayerCreateSpy.firstCall.args.should.deepEqual(['layer1', { layerId: 0, some: 'options' }])
    featureLayerCreateSpy.secondCall.args.should.deepEqual(['layer2', { layerId: 1, some: 'options' }])
    tableCreateSpy.callCount.should.equal(1)
    tableCreateSpy.firstCall.args.should.deepEqual(['table1', { layerId: 2, some: 'options' }])
  })
})
