const should = require('should');
const getSpatialReference = require('./get-spatial-reference');

describe('get-spatial-reference', () => {
  it('getSpatialReference: no data passed', () => {
    const wkt = getSpatialReference();
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });

  it('getSpatialReference: only inputCrs', () => {
    const wkt = getSpatialReference(undefined, {
      inputCrs: { wkid: 4326, latestWkid: 4326 },
    });
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });

  it('getSpatialReference: only inputCrs as wkt', () => {
    const wkt = `PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",
    GEOGCS["GCS_North_American_1983",
        DATUM["North_American_Datum_1983",
            SPHEROID["GRS_1980",6378137,298.257222101]],
        PRIMEM["Greenwich",0],
        UNIT["Degree",0.017453292519943295]],
    PROJECTION["Lambert_Conformal_Conic_2SP"],
    PARAMETER["False_Easting",6561666.666666666],
    PARAMETER["False_Northing",1640416.666666667],
    PARAMETER["Central_Meridian",-118],
    PARAMETER["Standard_Parallel_1",34.03333333333333],
    PARAMETER["Standard_Parallel_2",35.46666666666667],
    PARAMETER["Latitude_Of_Origin",33.5],
    UNIT["Foot_US",0.30480060960121924]]`;

    const sr = getSpatialReference(undefined, {
      inputCrs: {
        wkt,
      },
    });
    should(sr).deepEqual({ wkt });
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

  it('getSpatialReference: none, use default', () => {
    const wkt = getSpatialReference({ foo: 'bar' });
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });

  it('getSpatialReference: all inputs available', () => {
    const wkt = getSpatialReference(
      { crs: { properties: { name: 'epsg:3857' } } },
      { inputCrs: 4326, sourceSR: 102100 },
    );
    should(wkt).deepEqual({ wkid: 4326, latestWkid: 4326 });
  });
});
