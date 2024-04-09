const should = require('should'); // eslint-disable-line
const { normalizeSpatialReference } = require('.');

describe('normalize-spatial-reference', function () {
  it('undefined', () => {
    const spatialRef = normalizeSpatialReference();
    spatialRef.should.deepEqual({
      latestWkid: 4326,
      wkid: 4326,
    });
  });

  it('invalid object', () => {
    const spatialRef = normalizeSpatialReference({ test: 'foo' });
    spatialRef.should.deepEqual({
      latestWkid: 4326,
      wkid: 4326,
    });
  });

  it('invalid wkid', () => {
    const spatialRef = normalizeSpatialReference(99999);
    spatialRef.should.deepEqual({
      latestWkid: 4326,
      wkid: 4326,
    });
  });

  it('invalid wkt', () => {
    const spatialRef = normalizeSpatialReference('foodbar');
    spatialRef.should.deepEqual({
      latestWkid: 4326,
      wkid: 4326,
    });
  });

  it('object with wkt that is Web Mercator string', () => {
    const inputWkt =
      'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]';
    const spatialRef = normalizeSpatialReference({ wkt: inputWkt });
    spatialRef.should.deepEqual({
      latestWkid: 3857,
      wkid: 102100,
    });
  });

  it('object with wkt that is not Web Mercator string', () => {
    const inputWkt = `PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",
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
    UNIT["Foot_US",0.30480060960121924],
    AUTHORITY["EPSG","102645"]]`;
    const spatialRef = normalizeSpatialReference({ wkt: inputWkt });
    spatialRef.should.deepEqual({
      latestWkid: 2229,
      wkid: 102645,
    });
  });

  it('Web Mercator wkt string', () => {
    const inputWkt =
      'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]';
    const spatialRef = normalizeSpatialReference(inputWkt);
    spatialRef.should.deepEqual({
      latestWkid: 3857,
      wkid: 102100,
    });
  });

  it('prefixed wkid', () => {
    const spatialRef = normalizeSpatialReference('EPSG:3857');
    spatialRef.should.deepEqual({
      latestWkid: 3857,
      wkid: 3857,
    });
  });

  it('wkid number', () => {
    const spatialRef = normalizeSpatialReference(3857);
    spatialRef.should.deepEqual({
      latestWkid: 3857,
      wkid: 3857,
    });
  });

  it('wkid 102100', () => {
    const spatialRef = normalizeSpatialReference(102100);
    spatialRef.should.deepEqual({
      latestWkid: 3857,
      wkid: 102100,
    });
  });
  it('wkid 102100 extra properties', () => {
    const spatialRef = normalizeSpatialReference({
      wkid: 102100,
      latestWkid: 3857,
      xyTolerance: 0.001,
      zTolerance: 0.001,
      mTolerance: 0.001,
      falseX: -20037700,
      falseY: -30241100,
      xyUnits: 10000,
      falseZ: -100000,
      zUnits: 10000,
      falseM: -100000,
      mUnits: 10000,
    });
    spatialRef.should.deepEqual({
      latestWkid: 3857,
      wkid: 102100,
    });
  });
  it('wkid 7853 extra properties', () => {
    const spatialRef = normalizeSpatialReference({
      wkid: 7853,
      latestWkid: 7853,
      xyTolerance: 0.001,
      zTolerance: 0.001,
      mTolerance: 0.001,
      falseX: -5120900,
      falseY: 1900,
      xyUnits: 10000,
      falseZ: -100000,
      zUnits: 10000,
      falseM: -100000,
      mUnits: 10000,
    });
    spatialRef.should.deepEqual({
      latestWkid: 7853,
      wkid: 7853,
    });
  });
});
