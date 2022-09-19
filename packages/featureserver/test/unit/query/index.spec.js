const should = require('should') // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const filterAndTransformSpy = sinon.spy(function (data, params) {
  const { outStatistics } = params;

  if (outStatistics) {
    return { statistics: [{ fooStatistic: 1.234 }] };
  }
  return { features: ['filtered-feature'] };
});
const logWarningsSpy = sinon.spy();
const getGeometryTypeFromGeojsonSpy = sinon.spy(function () {
  return 'geometry-type';
});
const renderFeaturesResponseSpy = sinon.spy(function () {
  return 'features';
});
const renderStatisticsResponseSpy = sinon.spy(function () {
  return 'out-statistics';
});
const renderPrecalculatedStatisticsResponseSpy = sinon.spy(function () {
  return 'precalculated-statistics';
});
const renderCountAndExtentResponseSpy = sinon.spy(function () {
  return 'count-or-extent';
});

const stub = {
  './filter-and-transform': {
    filterAndTransform: filterAndTransformSpy
  },
  './log-warnings': {
    logWarnings: logWarningsSpy
  },
  './render-features': {
    renderFeaturesResponse: renderFeaturesResponseSpy
  },
  './render-statistics': {
    renderStatisticsResponse: renderStatisticsResponseSpy
  },
  './render-precalculated-statistics': {
    renderPrecalculatedStatisticsResponse: renderPrecalculatedStatisticsResponseSpy
  },
  './render-count-and-extent': {
    renderCountAndExtentResponse: renderCountAndExtentResponseSpy
  },
  '../helpers': {
    getGeometryTypeFromGeojson: getGeometryTypeFromGeojsonSpy
  }
};

const queryHandler = proxyquire('../../../lib/query', stub);

describe('query', () => {
  afterEach(function () {
    filterAndTransformSpy.resetHistory();
    logWarningsSpy.resetHistory();
    getGeometryTypeFromGeojsonSpy.resetHistory();
    renderFeaturesResponseSpy.resetHistory();
    renderStatisticsResponseSpy.resetHistory();
    renderPrecalculatedStatisticsResponseSpy.resetHistory();
    renderCountAndExtentResponseSpy.resetHistory();
  });

  describe('render precalculated data', () => {
    it('should render precalculated statistics', () => {
      const json = {
        statistics: 'statistics',
        metadata: 'metadata'
      };

      const result = queryHandler(json, { outStatistics: ['stats'] });
      result.should.equal('precalculated-statistics');
      renderPrecalculatedStatisticsResponseSpy.callCount.should.equal(1);
      renderPrecalculatedStatisticsResponseSpy.firstCall.args.should.deepEqual([json, {
        outStatistics: ['stats'],
        groupByFieldsForStatistics: undefined
      }]);
    });

    it('should render extent and count', () => {
      const json = {
        extent: 'extent',
        count: 'count'
      };

      const params = {
        returnExtentOnly: true,
        returnCountOnly: true
      };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        extent: 'extent',
        count: 'count'
      });
      renderPrecalculatedStatisticsResponseSpy.callCount.should.equal(0);
    });

    it('should render extent', () => {
      const json = {
        extent: 'extent',
        count: 'count'
      };

      const params = {
        returnExtentOnly: true
      };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        extent: 'extent'
      });
      renderPrecalculatedStatisticsResponseSpy.callCount.should.equal(0);
    });

    it('should render count', () => {
      const json = {
        extent: 'extent',
        count: 'count'
      };

      const params = {
        returnCountOnly: true
      };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        count: 'count'
      });
      renderPrecalculatedStatisticsResponseSpy.callCount.should.equal(0);
    });
  });

  describe('conditional filter and transform', () => {
    it('filter and return geojson', () => {
      const json = {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              OBJECTID: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          },
          {
            properties: {
              OBJECTID: 1954528849
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -106,
                41
              ]
            }
          }
        ]
      };

      const params = { f: 'geojson' };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        type: 'FeatureCollection',
        features: ['filtered-feature']
      });
      filterAndTransformSpy.callCount.should.equal(1);
      filterAndTransformSpy.firstCall.args.should.deepEqual([json, params]);
    });

    it('skip filter due to filtersApplied.all and return geojson', () => {
      const json = {
        filtersApplied: { all: true },
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              OBJECTID: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          },
          {
            properties: {
              OBJECTID: 1954528849
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -106,
                41
              ]
            }
          }
        ]
      };

      const params = { f: 'geojson' };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        type: 'FeatureCollection',
        features: json.features
      });
      filterAndTransformSpy.callCount.should.equal(0);
    });

    it('skip filter due to missing features and return geojson', () => {
      const json = {
        filtersApplied: { all: true },
        type: 'FeatureCollection',
        features: []
      };

      const params = { f: 'geojson' };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        type: 'FeatureCollection',
        features: json.features
      });
      filterAndTransformSpy.callCount.should.equal(0);
    });
  });

  describe('logWarnings', () => {
    it('should try to log warnings', () => {
      const json = {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              OBJECTID: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          }
        ]
      };

      const params = { f: 'geojson' };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        type: 'FeatureCollection',
        features: ['filtered-feature']
      });
      logWarningsSpy.callCount.should.equal(1);
    });

    it('should not try to log warnings in production', () => {
      const json = {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              OBJECTID: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          }
        ]
      };

      const params = { f: 'geojson' };

      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const result = queryHandler(json, params);
      result.should.deepEqual({
        type: 'FeatureCollection',
        features: ['filtered-feature']
      });
      logWarningsSpy.callCount.should.equal(0);
      process.env.NODE_ENV = nodeEnv;
    });

    it('should not try to log warnings when suppressed', () => {
      const json = {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              OBJECTID: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          }
        ]
      };

      const params = { f: 'geojson' };

      process.env.KOOP_WARNINGS = 'suppress';
      const result = queryHandler(json, params);
      result.should.deepEqual({
        type: 'FeatureCollection',
        features: ['filtered-feature']
      });
      logWarningsSpy.callCount.should.equal(0);
    });
  });

  it('should get geometryType from json', () => {
    const json = {
      filtersApplied: { all: true },
      type: 'FeatureCollection',
      features: [
        {
          properties: {
            OBJECTID: 1138516379
          },
          geometry: {
            type: 'Point',
            coordinates: [
              -104,
              40
            ]
          }
        }
      ]
    };

    const params = { returnCountOnly: true };

    const result = queryHandler(json, params);
    result.should.equal('count-or-extent');
    getGeometryTypeFromGeojsonSpy.callCount.should.equal(1);
    getGeometryTypeFromGeojsonSpy.firstCall.args.should.deepEqual([json]);
  });

  it('should return count', () => {
    const json = {
      type: 'FeatureCollection',
      features: [
        {
          properties: {
            OBJECTID: 1138516379
          },
          geometry: {
            type: 'Point',
            coordinates: [
              -104,
              40
            ]
          }
        }
      ]
    };

    const params = { returnCountOnly: true };

    const result = queryHandler(json, params);
    result.should.deepEqual('count-or-extent');
    renderCountAndExtentResponseSpy.callCount.should.equal(1);
    renderCountAndExtentResponseSpy.firstCall.args.should.deepEqual([{
      features: ['filtered-feature']
    }, {
      ...params,
      outSR: undefined,
      returnExtentOnly: undefined
    }]);
  });

  it('should return extent', () => {
    const json = {
      type: 'FeatureCollection',
      features: [
        {
          properties: {
            OBJECTID: 1138516379
          },
          geometry: {
            type: 'Point',
            coordinates: [
              -104,
              40
            ]
          }
        }
      ]
    };

    const params = { returnExtentOnly: true };

    const result = queryHandler(json, params);
    result.should.deepEqual('count-or-extent');
    renderCountAndExtentResponseSpy.callCount.should.equal(1);
    renderCountAndExtentResponseSpy.firstCall.args.should.deepEqual([{
      features: ['filtered-feature']
    }, {
      ...params,
      outSR: undefined,
      returnCountOnly: undefined
    }]);
  });

  it('should return extent and count', () => {
    const json = {
      type: 'FeatureCollection',
      features: [
        {
          properties: {
            OBJECTID: 1138516379
          },
          geometry: {
            type: 'Point',
            coordinates: [
              -104,
              40
            ]
          }
        }
      ]
    };

    const params = { returnExtentOnly: true, returnCountOnly: true };

    const result = queryHandler(json, params);
    result.should.deepEqual('count-or-extent');
    renderCountAndExtentResponseSpy.callCount.should.equal(1);
    renderCountAndExtentResponseSpy.firstCall.args.should.deepEqual([{
      features: ['filtered-feature']
    }, {
      ...params,
      outSR: undefined
    }]);
  });

  describe('should return ids only', () => {
    it('should return ids without use of idField', () => {
      const filterAndTransformSpy = sinon.spy(function () {
        return { features: [{ attributes: { OBJECTID: 1138516379 } }] };
      });
      const queryHandler = proxyquire('../../../lib/query', {
        ...stub,
        './filter-and-transform': {
          filterAndTransform: filterAndTransformSpy
        }
      });
      const json = {
        type: 'FeatureCollection',
        features: [
          {
            properties: {
              OBJECTID: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          }
        ]
      };

      const params = { returnIdsOnly: true };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        objectIdFieldName: 'OBJECTID',
        objectIds: [1138516379]
      });
    });

    it('should return ids with idField', () => {
      const filterAndTransformSpy = sinon.spy(function ({ metadata }) {
        return { metadata, features: [{ attributes: { anIdProp: 1138516379 } }] };
      });
      const queryHandler = proxyquire('../../../lib/query', {
        ...stub,
        './filter-and-transform': {
          filterAndTransform: filterAndTransformSpy
        }
      });
      const json = {
        type: 'FeatureCollection',
        metadata: { idField: 'anIdProp' },
        features: [
          {
            properties: {
              anIdProp: 1138516379
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -104,
                40
              ]
            }
          }
        ]
      };

      const params = { returnIdsOnly: true };

      const result = queryHandler(json, params);
      result.should.deepEqual({
        objectIdFieldName: 'anIdProp',
        objectIds: [1138516379]
      });
    });
  });

  it('should return outStatistics', () => {
    const json = {
      type: 'FeatureCollection',
      features: [
        {
          properties: {
            OBJECTID: 1138516379
          },
          geometry: {
            type: 'Point',
            coordinates: [
              -104,
              40
            ]
          }
        }
      ]
    };

    const params = {
      outStatistics: [{
        statisticType: 'MIN',
        onStatisticField: 'total precip',
        outStatisticFieldName: 'min_precip'
      }]
    };

    const result = queryHandler(json, params);
    result.should.deepEqual('out-statistics');
    renderStatisticsResponseSpy.callCount.should.equal(1);
    renderStatisticsResponseSpy.firstCall.args.should.deepEqual([{
      statistics: [{ fooStatistic: 1.234 }]
    }, {
      ...params,
      geometryType: 'geometry-type',
      attributeSample: {
        OBJECTID: 1138516379
      }
    }]);
  });

  it('should return feature response', () => {
    const json = {
      type: 'FeatureCollection',
      features: [
        {
          properties: {
            OBJECTID: 1138516379
          },
          geometry: {
            type: 'Point',
            coordinates: [
              -104,
              40
            ]
          }
        }
      ]
    };

    const result = queryHandler(json);
    result.should.deepEqual('features');
    renderFeaturesResponseSpy.callCount.should.equal(1);
    renderFeaturesResponseSpy.firstCall.args.should.deepEqual([{
      features: ['filtered-feature']
    }, {
      geometryType: 'geometry-type',
      attributeSample: {
        OBJECTID: 1138516379
      }
    }]);
  });
});
