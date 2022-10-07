const should = require('should') // eslint-disable-line
const calculateExtent = require('./calculate-extent');

describe('calculate-extent', () => {
  it('calculateExtent: no data passed', () => {
    const extent = calculateExtent({});
    should(extent).equal(undefined);
  });

  it('calculateExtent: Point', () => {
    const extent = calculateExtent({
      isLayer: true,
      geojson: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [102.0, 0.5]
        },
        properties: {
          prop0: 'value0'
        }
      },
      spatialReference: 4326
    });
    should(extent).deepEqual({ xmin: 102, ymin: 0.5, xmax: 102, ymax: 0.5, spatialReference: 4326 });
  });

  it('calculateExtent: LineString', () => {
    const extent = calculateExtent({
      isLayer: true,
      geojson: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [102.0, 0.5],
            [102.3, 0.8],
            [103.1, 1.2],
            [103.0, 1.0],
            [102.6, 0.9]
          ]
        },
        properties: {
          prop0: 'value0'
        }
      },
      spatialReference: 4326
    });
    should(extent).deepEqual({ xmin: 102, ymin: 0.5, xmax: 103.1, ymax: 1.2, spatialReference: 4326 });
  });

  it('calculateExtent: Polygon', () => {
    const extent = calculateExtent({
      isLayer: true,
      geojson: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0]
            ]
          ]
        },
        properties: {
          prop0: 'value0'
        }
      },
      spatialReference: 102100
    });
    should(extent).deepEqual({ xmin: 100, ymin: 0.0, xmax: 101.0, ymax: 1.0, spatialReference: 102100 });
  });
});
