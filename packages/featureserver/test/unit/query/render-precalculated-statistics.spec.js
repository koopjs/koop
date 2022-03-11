const should = require('should') // eslint-disable-line
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const computeFieldObjectSpy = sinon.spy(function () {
  return [
    {
      alias: 'dateField',
      defaultValue: null,
      domain: null,
      length: 36,
      name: 'dateField',
      sqlType: 'sqlTypeOther',
      type: 'esriFieldTypeDate'
    }
  ]
})

const stub = {
  '../field': {
    computeFieldObject: computeFieldObjectSpy
  }
}

const { renderPrecalculatedStatisticsResponse } = proxyquire('../../../lib/query/render-precalculated-statistics', stub)

describe('renderPrecalculatedStatisticsResponse', () => {
  afterEach(function () {
    computeFieldObjectSpy.resetHistory()
  })

  it('should convert precalculated statistics array without metadata to Geoservices JSON', () => {
    const statistics = [
      {
        FACUSE: 'Middle School',
        TOTAL_STUD_SUM: 5421,
        ZIP_CODE_COUNT: 18,
        SOME_DATE_STRING: '2020-12-01',
        SOME_ISO_DATE_STRING: '2020-12-01T17:00:14.000Z'
      },
      {
        FACUSE: 'Elementary School',
        TOTAL_STUD_SUM: 23802,
        ZIP_CODE_COUNT: 72,
        SOME_DATE_STRING: '2020-12-01',
        SOME_ISO_DATE_STRING: '2020-12-01T17:00:14.000Z'
      }
    ]
    const result = renderPrecalculatedStatisticsResponse({ statistics })
    result.should.deepEqual({
      displayFieldName: '',
      fields: [
        {
          alias: 'FACUSE',
          length: 254,
          name: 'FACUSE',
          type: 'esriFieldTypeString'
        },
        {
          alias: 'TOTAL_STUD_SUM',
          name: 'TOTAL_STUD_SUM',
          type: 'esriFieldTypeDouble'
        },
        {
          alias: 'ZIP_CODE_COUNT',
          name: 'ZIP_CODE_COUNT',
          type: 'esriFieldTypeDouble'
        },
        {
          alias: 'SOME_DATE_STRING',
          name: 'SOME_DATE_STRING',
          type: 'esriFieldTypeDate'
        },
        {
          alias: 'SOME_ISO_DATE_STRING',
          name: 'SOME_ISO_DATE_STRING',
          type: 'esriFieldTypeDate'
        }
      ],
      fieldAliases: {
        FACUSE: 'FACUSE',
        TOTAL_STUD_SUM: 'TOTAL_STUD_SUM',
        ZIP_CODE_COUNT: 'ZIP_CODE_COUNT',
        SOME_DATE_STRING: 'SOME_DATE_STRING',
        SOME_ISO_DATE_STRING: 'SOME_ISO_DATE_STRING'
      },
      features: [
        {
          attributes: {
            FACUSE: 'Middle School',
            TOTAL_STUD_SUM: 5421,
            ZIP_CODE_COUNT: 18,
            SOME_DATE_STRING: 1606780800000,
            SOME_ISO_DATE_STRING: 1606842014000
          }
        },
        {
          attributes: {
            FACUSE: 'Elementary School',
            TOTAL_STUD_SUM: 23802,
            ZIP_CODE_COUNT: 72,
            SOME_DATE_STRING: 1606780800000,
            SOME_ISO_DATE_STRING: 1606842014000
          }
        }
      ]
    })
    computeFieldObjectSpy.callCount.should.equal(0)
  })

  it('should convert precalculated statistics object without metadata to Geoservices JSON', () => {
    const statistics = {
      FACUSE: 'Middle School',
      TOTAL_STUD_SUM: 5421,
      ZIP_CODE_COUNT: 18
    }
    const result = renderPrecalculatedStatisticsResponse({ statistics })
    result.should.deepEqual({
      displayFieldName: '',
      fields: [
        {
          alias: 'FACUSE',
          length: 254,
          name: 'FACUSE',
          type: 'esriFieldTypeString'
        },
        {
          alias: 'TOTAL_STUD_SUM',
          name: 'TOTAL_STUD_SUM',
          type: 'esriFieldTypeDouble'
        },
        {
          alias: 'ZIP_CODE_COUNT',
          name: 'ZIP_CODE_COUNT',
          type: 'esriFieldTypeDouble'
        }
      ],
      fieldAliases: {
        FACUSE: 'FACUSE',
        TOTAL_STUD_SUM: 'TOTAL_STUD_SUM',
        ZIP_CODE_COUNT: 'ZIP_CODE_COUNT'
      },
      features: [
        {
          attributes: {
            FACUSE: 'Middle School',
            TOTAL_STUD_SUM: 5421,
            ZIP_CODE_COUNT: 18
          }
        }
      ]
    })
    computeFieldObjectSpy.callCount.should.equal(0)
  })

  it('should convert precalculated statistics object to Geoservices JSON, acquire fields from metadata', () => {
    const statistics = {
      dateField: 1497578316179
    }
    const metadata = {
      fields: [
        {
          name: 'dateField',
          type: 'Date'
        }
      ]
    }

    const result = renderPrecalculatedStatisticsResponse({ statistics, metadata })
    result.should.deepEqual({
      displayFieldName: '',
      fields: [
        {
          alias: 'dateField',
          defaultValue: null,
          domain: null,
          length: 36,
          name: 'dateField',
          sqlType: 'sqlTypeOther',
          type: 'esriFieldTypeDate'
        }
      ],
      fieldAliases: {
        dateField: 'dateField'
      },
      features: [
        {
          attributes: {
            dateField: 1497578316179
          }
        }
      ]
    })
    computeFieldObjectSpy.callCount.should.equal(1)
  })

  // it('should convert statistics object to Geoservices JSON', () => {
  //   const result = renderStatisticsResponse({ min_precip: 0 }, {
  //     outStatistics: [{
  //       statisticType: 'MIN',
  //       onStatisticField: 'total precip',
  //       outStatisticFieldName: 'min_precip'
  //     }]
  //   })
  //   result.should.deepEqual({
  //     displayFieldName:'',
  //     fields: {
  //       foo: 'bar'
  //     },
  //     features: [
  //       {
  //         attributes: {
  //           min_precip: 0
  //         }
  //       }
  //     ]
  //   })
  //   computeFieldObjectSpy.callCount.should.equal(1)
  //   computeFieldObjectSpy.firstCall.args.should.deepEqual([
  //     { type: 'FeatureCollection', features: [{ attributes: { min_precip: 0 } }] },
  //     'statistics',
  //     {
  //       outStatistics: [{
  //         statisticType: 'MIN',
  //         onStatisticField: 'total precip',
  //         outStatisticFieldName: 'min_precip'
  //       }]
  //     }
  //   ])
  // })
})
