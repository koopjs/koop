const should = require('should');
const { getGeometryTypeFromGeojson } = require('.');

describe('get-geometry-type-from-geojson', function () {
  it('undefined input returns undefined', () => {
    const result = getGeometryTypeFromGeojson();
    should(result).equal();
  });

  it('string input returns undefined', () => {
    const result = getGeometryTypeFromGeojson('foo');
    should(result).equal();
  });

  it('empty object returns undefined', () => {
    const result = getGeometryTypeFromGeojson({});
    should(result).equal();
  });

  it('defers to root-level geometryType', () => {
    const result = getGeometryTypeFromGeojson({
      geometryType: 'Point',
      metadata: { geometryType: 'foo' },
    });
    result.should.equal('esriGeometryPoint');
  });

  it('uses metadata.geometryType when no root-level geometryType', () => {
    const result = getGeometryTypeFromGeojson({
      metadata: { geometryType: 'Point' },
    });
    result.should.equal('esriGeometryPoint');
  });

  it('uses feature geometry-type if no other source', () => {
    const result = getGeometryTypeFromGeojson({
      features: [{ geometry: { type: 'Point' } }],
    });
    result.should.equal('esriGeometryPoint');
  });

  it('Searches for first feature geometry-type if no other source', () => {
    const result = getGeometryTypeFromGeojson({
      features: [{ geometry: null }, { geometry: { type: 'Point' } }],
    });
    result.should.equal('esriGeometryPoint');
  });

  it('returns undefined feature geometry-type not defined', () => {
    const result = getGeometryTypeFromGeojson({
      features: [{ geometry: null }],
    });
    should(result).equal();
  });

  it('supports defined set of input types', () => {
    const types = {
      Point: 'esriGeometryPoint',
      MultiPoint: 'esriGeometryMultipoint',
      LineString: 'esriGeometryPolyline',
      MultiLineString: 'esriGeometryPolyline',
      Polygon: 'esriGeometryPolygon',
      MultiPolygon: 'esriGeometryPolygon',
    };
    Object.entries(types).forEach(([key, value]) => {
      const result = getGeometryTypeFromGeojson({ geometryType: key });
      result.should.equal(value);
    });
  });

  it('returns undefined for unsupported geometry types', () => {
    const result = getGeometryTypeFromGeojson({ geometryType: 'Other' });
    should(result).equal();
  });
});
