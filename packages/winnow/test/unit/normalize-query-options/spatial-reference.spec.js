const test = require('tape')
const normalizeSpatialReference = require('../../../lib/normalize-query-options/spatial-reference')

test('normalize-query-options, spatial-reference: undefined', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference()
  t.equal(spatialRef, undefined)
})

test('normalize-query-options, spatial-reference: invalid type', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference(true)
  t.equal(spatialRef, undefined)
})

test('normalize-query-options, spatial-reference: invalid object', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference({ test: 'foo' })
  t.equal(spatialRef, undefined)
})

test('normalize-query-options, spatial-reference: invalid wkid', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference(99999)
  t.equal(spatialRef, undefined)
})

test('normalize-query-options, spatial-reference: invalid wkt', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference('foodbar')
  t.equal(spatialRef, undefined)
})

test('normalize-query-options, spatial-reference: object with wkid from proj4 list', t => {
  t.plan(1)
  const { wkid } = normalizeSpatialReference({ wkid: 4269 })
  t.equal(wkid, 4269)
})

test('normalize-query-options, spatial-reference: object with latest wkid from proj4 list', t => {
  t.plan(1)
  const { wkid } = normalizeSpatialReference({ latestWkid: 4269 })
  t.equal(wkid, 4269)
})

test('normalize-query-options, spatial-reference: object with wkt that is Web Mercator string', t => {
  t.plan(1)
  const inputWkt = 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
  const { wkid } = normalizeSpatialReference({ wkt: inputWkt })
  t.equal(wkid, 3857)
})

test('normalize-query-options, spatial-reference: object with wkt that is not Web Mercator string', t => {
  t.plan(2)
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
  AUTHORITY["EPSG","102645"]]`
  const { wkid, wkt } = normalizeSpatialReference({ wkt: inputWkt })
  t.equal(wkt, inputWkt)
  t.equal(wkid, 102645)
})

test('normalize-query-options, spatial-reference: Web Mercator wkt string', t => {
  t.plan(1)
  const inputWkt = 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
  const { wkid } = normalizeSpatialReference(inputWkt)
  t.equal(wkid, 3857)
})

test('normalize-query-options, spatial-reference: non Web Mercator wkt string', t => {
  t.plan(2)
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
  AUTHORITY["EPSG","102645"]]`
  const { wkt, wkid } = normalizeSpatialReference(inputWkt)
  t.equal(wkt, inputWkt)
  t.equal(wkid, 102645)
})

test('normalize-query-options, spatial-reference: prefixed wkid', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference('EPSG:3857')
  t.equal(spatialRef.wkid, 3857)
})

test('normalize-query-options, spatial-reference: wkid number', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference(3857)
  t.equal(spatialRef.wkid, 3857)
})

test('normalize-query-options, spatial-reference: wkid 102100', t => {
  t.plan(1)
  const spatialRef = normalizeSpatialReference(102100)
  t.equal(spatialRef.wkid, 3857)
})

test('normalize-query-options, spatial-reference: wkid not in Proj4 list', t => {
  t.plan(2)
  const inputWkt = 'PROJCS["NAD_1983_HARN_StatePlane_Washington_North_FIPS_4601",GEOGCS["GCS_North_American_1983_HARN",DATUM["D_North_American_1983_HARN",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-120.8333333333333],PARAMETER["Standard_Parallel_1",47.5],PARAMETER["Standard_Parallel_2",48.73333333333333],PARAMETER["Latitude_Of_Origin",47.0],UNIT["Meter",1.0]]'
  const { wkt, wkid } = normalizeSpatialReference(2855)
  t.equal(wkt, inputWkt)
  t.equal(wkid, 2855)
})
