const should = require('should'); // eslint-disable-line
const isTable = require('./is-geojson-table');

describe('is-geojson-table', function () {
  it('undefined input should return true', () => {
    const result = isTable();
    should(result).be.exactly(true);
  });

  it('non-object input should return true', () => {
    const result = isTable('test');
    should(result).be.exactly(true);
  });

  it('GeoJSON collection input with geometry should return false', () => {
    const collection = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-100, 40] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-101, 41] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-99, 39] },
        },
      ],
    };
    const result = isTable(collection);
    should(result).be.exactly(false);
  });

  it('GeoJSON collection input with NO geometry should return true', () => {
    const collection = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [{ type: 'Feature', properties: {} }],
    };
    const result = isTable(collection);
    should(result).be.exactly(true);
  });

  it('GeoJSON collection input with valid geometryType should return false', () => {
    const collection = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [{ type: 'Feature', properties: {} }],
    };
    const geomTypes = [
      'Point',
      'MultiPoint',
      'LineString',
      'MultiLineString',
      'Polygon',
      'MultiPolygon',
    ];
    geomTypes.forEach((geomType) => {
      collection.geometryType = geomType;
      const result = isTable(collection);
      should(result).be.exactly(false);
    });
  });

  it('GeoJSON collection input with INvalid geometryType should return true', () => {
    const collection = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [{ type: 'Feature', properties: {} }],
    };
    const geomTypes = ['Other'];
    geomTypes.forEach((geomType) => {
      collection.geomType = geomType;
      const result = isTable(collection);
      should(result).be.exactly(true);
    });
  });

  it('GeoJSON collection input without features should return true', () => {
    const collection = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [],
    };
    const result = isTable(collection);
    should(result).be.exactly(true);
  });

  it('GeoJSON collection input with metadata geometryType but no features should return false', () => {
    const collection = {
      metadata: { geometryType: 'Point' },
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [],
    };
    const result = isTable(collection);
    should(result).be.exactly(false);
  });
});
