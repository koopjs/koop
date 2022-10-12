const should = require('should') // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const createStatisticsFieldsSpy = sinon.spy(function () {
  return [{
    foo: 'bar'
  }];
});

const fields = {
  StatisticsFields: {
    create: createStatisticsFieldsSpy
  }
};

const stub = {
  '../helpers/fields': fields
};

const { renderStatisticsResponse } = proxyquire('./render-statistics', stub);

describe('renderStatisticsResponse', () => {
  afterEach(function () {
    createStatisticsFieldsSpy.resetHistory();
  });

  it('should convert statistics array to Geoservices JSON', () => {
    const result = renderStatisticsResponse({ statistics: [{ min_precip: 0 }] }, {
      outStatistics: [{
        statisticType: 'MIN',
        onStatisticField: 'total precip',
        outStatisticFieldName: 'min_precip'
      }]
    });
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
    });
    createStatisticsFieldsSpy.callCount.should.equal(1);
    createStatisticsFieldsSpy.firstCall.args.should.deepEqual([
      {
        statistics: [{ min_precip: 0 }],
        outStatistics: [{
          statisticType: 'MIN',
          onStatisticField: 'total precip',
          outStatisticFieldName: 'min_precip'
        }]
      }
    ]);
  });

  it('should convert statistics object to Geoservices JSON', () => {
    const result = renderStatisticsResponse({ statistics: { min_precip: 0 } }, {
      outStatistics: [{
        statisticType: 'MIN',
        onStatisticField: 'total precip',
        outStatisticFieldName: 'min_precip'
      }]
    });
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
    });
    createStatisticsFieldsSpy.callCount.should.equal(1);
    createStatisticsFieldsSpy.firstCall.args.should.deepEqual([
      {
        statistics: { min_precip: 0 },
        outStatistics: [{
          statisticType: 'MIN',
          onStatisticField: 'total precip',
          outStatisticFieldName: 'min_precip'
        }]
      }
    ]);
  });
});
