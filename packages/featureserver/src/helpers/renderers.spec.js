const should = require('should');
should.config.checkProtoEql = false;

const {
  PointRenderer,
  PolygonRenderer,
  LineRenderer
} = require('./renderers');

describe('Renderers', () => {
  it('should produce default PointRenderer instance', () => {
    const renderer = new PointRenderer();
    renderer.should.deepEqual({
      type: 'simple',
      symbol: {
        color: [
          247,
          150,
          70,
          161
        ],
        outline: {
          color: [
            190,
            190,
            190,
            105
          ],
          width: 0.5,
          type: 'esriSLS',
          style: 'esriSLSSolid'
        },
        size: 7.5,
        type: 'esriSMS',
        style: 'esriSMSCircle'
      }
    });
  });

  it('should produce default LineRenderer instance', () => {
    const renderer = new LineRenderer();
    renderer.should.deepEqual({
      type: 'simple',
      symbol: {
        color: [
          247,
          150,
          70,
          204
        ],
        width: 6.999999999999999,
        type: 'esriSLS',
        style: 'esriSLSSolid'
      }
    });
  });

  it('should produce default PolygonRenderer instance', () => {
    const renderer = new PolygonRenderer();
    renderer.should.deepEqual({
      type: 'simple',
      symbol: {
        color: [
          75,
          172,
          198,
          161
        ],
        outline: {
          color: [
            150,
            150,
            150,
            155
          ],
          width: 0.5,
          type: 'esriSLS',
          style: 'esriSLSSolid'
        },
        type: 'esriSFS',
        style: 'esriSFSSolid'
      }
    });
  });
});
