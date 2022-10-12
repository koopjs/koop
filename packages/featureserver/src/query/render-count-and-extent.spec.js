const should = require('should') // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const esriExtentSpy = sinon.spy(function () {
  return {
    foo: 'bar',
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  };
});

const stub = {
  'esri-extent': esriExtentSpy
};

const { renderCountAndExtentResponse } = proxyquire('./render-count-and-extent', stub);

describe('renderCountAndExtent', () => {
  afterEach(function () {
    esriExtentSpy.resetHistory();
  });

  it('should render count and extent', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnCountOnly: true, returnExtentOnly: true });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      },
      count: 1
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render count', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnCountOnly: true });
    result.should.deepEqual({
      count: 1
    });
    esriExtentSpy.callCount.should.equal(0);
  });

  it('should render extent', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render extent and replace spatialReference with outSR wkid', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true, outSR: { wkid: 1234 } });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkid: 1234
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render extent and replace spatialReference with outSR latestWkid', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true, outSR: { latestWkid: 1234 } });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          latestWkid: 1234
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render extent and replace spatialReference with outSR wkt', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true, outSR: { wkt: '1234' } });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkt: '1234'
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render extent and replace spatialReference with outSR id', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true, outSR: 1234 });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkid: 1234
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render extent and replace spatialReference with outSR string id', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true, outSR: '1234' });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkid: 1234
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });

  it('should render extent and replace spatialReference with outSR string', () => {
    const result = renderCountAndExtentResponse({ features: ['test'] }, { returnExtentOnly: true, outSR: 'big-WKT-string' });
    result.should.deepEqual({
      extent: {
        foo: 'bar',
        spatialReference: {
          wkt: 'big-WKT-string'
        }
      }
    });
    esriExtentSpy.callCount.should.equal(1);
    esriExtentSpy.firstCall.args.should.deepEqual([{ features: ['test'] }]);
  });
});
