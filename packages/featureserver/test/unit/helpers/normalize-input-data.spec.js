const should = require('should') // eslint-disable-line
const { normalizeInputData } = require('../../../lib/helpers');

describe('normalize-input-data', function () {
  it('undefined input should return empty tables and layers', () => {
    const result = normalizeInputData();
    result.should.deepEqual({ tables: [], layers: [], relationships: [] });
  });

  it('non-object input should return empty tables and layers', () => {
    const result = normalizeInputData('test');
    result.should.deepEqual({ tables: [], layers: [], relationships: [] });
  });

  it('GeoJSON collection input with geometry should return single layer', () => {
    const collection = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] };
    const result = normalizeInputData(collection);
    result.should.deepEqual({ tables: [], layers: [collection], relationships: [] });
  });

  it('GeoJSON collection input without features should return single table', () => {
    const collection = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [] };
    const result = normalizeInputData(collection);
    result.should.deepEqual({ tables: [collection], layers: [], relationships: [] });
  });

  it('GeoJSON collection input with metadata geometryType but no features should return single layer', () => {
    const collection = { metadata: { geometryType: 'Point' }, type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [] };
    const result = normalizeInputData(collection);
    result.should.deepEqual({ tables: [], layers: [collection], relationships: [] });
  });

  it('GeoJSON metadata layers and tables should be returned unaltered', () => {
    const collection1 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [] };
    const collection2 = { type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }, features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-100, 40] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-101, 41] } }, { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-99, 39] } }] };
    const result = normalizeInputData({ layers: [collection1], tables: [collection2], relationships: [] });
    result.should.deepEqual({ tables: [collection2], layers: [collection1], relationships: [] });
  });
});
