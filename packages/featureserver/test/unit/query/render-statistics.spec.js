const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const computeFieldObjectSpy = sinon.spy(function () {
  return [{
    foo: 'bar'
  }]
})

const stub = {
  '../field': {
    computeFieldObject: computeFieldObjectSpy
  }
}

const { renderStatisticsResponse } = proxyquire('../../../lib/query/render-statistics', stub)

describe('renderStatisticsResponse', () => {
  afterEach(function () {
    computeFieldObjectSpy.resetHistory()
  })

  it('should convert statistics array to Geoservices JSON', () => {
    const result = renderStatisticsResponse({ statistics: [{ min_precip: 0 }] }, {
      outStatistics: [{
        statisticType: 'MIN',
        onStatisticField: 'total precip',
        outStatisticFieldName: 'min_precip'
      }]
    })
    result.should.deepEqual({
      displayFieldName: '',
      fields: [{
        foo: 'bar'
      }],
      features: [
        {
          attributes: {
            min_precip: 0
          }
        }
      ]
    })
    computeFieldObjectSpy.callCount.should.equal(1)
    computeFieldObjectSpy.firstCall.args.should.deepEqual([
      { type: 'FeatureCollection', features: [{ attributes: { min_precip: 0 } }] },
      'statistics',
      {
        outStatistics: [{
          statisticType: 'MIN',
          onStatisticField: 'total precip',
          outStatisticFieldName: 'min_precip'
        }]
      }
    ])
  })

  it('should convert statistics object to Geoservices JSON', () => {
    const result = renderStatisticsResponse({ statistics: { min_precip: 0 } }, {
      outStatistics: [{
        statisticType: 'MIN',
        onStatisticField: 'total precip',
        outStatisticFieldName: 'min_precip'
      }]
    })
    result.should.deepEqual({
      displayFieldName: '',
      fields: [{
        foo: 'bar'
      }],
      features: [
        {
          attributes: {
            min_precip: 0
          }
        }
      ]
    })
    computeFieldObjectSpy.callCount.should.equal(1)
    computeFieldObjectSpy.firstCall.args.should.deepEqual([
      { type: 'FeatureCollection', features: [{ attributes: { min_precip: 0 } }] },
      'statistics',
      {
        outStatistics: [{
          statisticType: 'MIN',
          onStatisticField: 'total precip',
          outStatisticFieldName: 'min_precip'
        }]
      }
    ])
  })
})
