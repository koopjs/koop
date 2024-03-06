class PointRenderer {
  constructor () {
    Object.assign(this, {
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
  }
}

class LineRenderer {
  constructor () {
    Object.assign(this, {
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
  }
}

class PolygonRenderer {
  constructor () {
    Object.assign(this, {
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
  }
}

module.exports = {
  PointRenderer,
  PolygonRenderer,
  LineRenderer
};
