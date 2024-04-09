const should = require('should'); // eslint-disable-line
const getSpatialReference = require('./get-spatial-reference');

describe('get-spatial-reference', () => {
  it('getSpatialReference: no data passed', () => {
    const wkt = getSpatialReference();
    should(wkt).equal(undefined);
  });

  it('getSpatialReference: only inputCrs', () => {
    const wkt = getSpatialReference(undefined, {
      inputCrs: { wkid: 4326, latestWkid: 4326 },
    });
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });

  it('getSpatialReference: numeric inputCrs', () => {
    const wkt = getSpatialReference(undefined, { inputCrs: 4326 });
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });

  it('getSpatialReference: mercator inputCrs', () => {
    const wkt = getSpatialReference(undefined, { inputCrs: 102100 });
    should(wkt).deepEqual({ wkid: 102100, latestWkid: 3857 });
  });

  it('getSpatialReference: only sourceSR', () => {
    const wkt = getSpatialReference(undefined, { sourceSR: 3857 });
    should(wkt).deepEqual({ wkid: 3857, latestWkid: 3857 });
  });

  it('getSpatialReference: only geojson', () => {
    const wkt = getSpatialReference({
      crs: { properties: { name: 'epsg:3857' } },
    });
    should(wkt).deepEqual({ wkid: 3857, latestWkid: 3857 });
  });

  it('getSpatialReference: all inputs available', () => {
    const wkt = getSpatialReference(
      { crs: { properties: { name: 'epsg:3857' } } },
      { inputCrs: 4326, sourceSR: 102100 },
    );
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });
});
