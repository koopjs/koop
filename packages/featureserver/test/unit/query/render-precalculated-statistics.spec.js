const should = require('should') // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const createStatisticsFieldsSpy = sinon.spy(function () {
  return ['fields'];
});

const fields = {
  StatisticsFields: {
    create: createStatisticsFieldsSpy
  }
};

const stub = {
  '../helpers/fields': fields
};

const { renderPrecalculatedStatisticsResponse } = proxyquire('../../../lib/query/render-precalculated-statistics', stub);

describe('renderPrecalculatedStatisticsResponse', () => {
  afterEach(function () {
    createStatisticsFieldsSpy.resetHistory();
  });

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
    ];
    const result = renderPrecalculatedStatisticsResponse({ statistics });
    result.should.deepEqual({
      fields: ['fields'],
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
    });
    createStatisticsFieldsSpy.callCount.should.equal(1);
  });

  it('should convert precalculated statistics object without metadata to Geoservices JSON', () => {
    const statistics = {
      FACUSE: 'Middle School',
      TOTAL_STUD_SUM: 5421,
      ZIP_CODE_COUNT: 18
    };
    const result = renderPrecalculatedStatisticsResponse({ statistics });
    result.should.deepEqual({
      fields: ['fields'],
      features: [
        {
          attributes: {
            FACUSE: 'Middle School',
            TOTAL_STUD_SUM: 5421,
            ZIP_CODE_COUNT: 18
          }
        }
      ]
    });
    createStatisticsFieldsSpy.callCount.should.equal(1);
  });
});
