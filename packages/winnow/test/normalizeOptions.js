const test = require('tape')
const { normalizeSR, normalizeInSR, normalizeSourceSR } = require('../src/options/normalizeOptions')

test('normalize SR with a wkid in the known list', t => {
  t.plan(1)
  const SR = normalizeSR({ wkid: 4269 })
  t.equal(SR.wkid, 4269)
})

test('normalize SR with a latest wkid in the known list', t => {
  t.plan(1)
  const SR = normalizeSR({ latestWkid: 4269 })
  t.equal(SR.wkid, 4269)
})

test('normalize SR with a Web Mercator wkt string in an object', t => {
  t.plan(1)
  const wkt = 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
  const SR = normalizeSR({ wkt })
  t.equal(SR.wkid, 3857)
})

test('normalize SR with a Web Mercator wkt string', t => {
  t.plan(1)
  const wkt = 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
  const SR = normalizeSR(wkt)
  t.equal(SR.wkid, 3857)
})

test('normalize SR with a wkt string', t => {
  t.plan(1)
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
  UNIT["Foot_US",0.30480060960121924],
  AUTHORITY["EPSG","102645"]]`
  const SR = normalizeSR(wkt)
  t.equal(SR.wkt, wkt)
})

test('normalize SR with a EPSG:3857 string', t => {
  t.plan(1)
  const SR = normalizeSR('EPSG:3857')
  t.equal(SR.wkid, 3857)
})

test('normalize SR with a 3857 number', t => {
  t.plan(1)
  const SR = normalizeSR(3857)
  t.equal(SR.wkid, 3857)
})

test('normalize SR with a 102100 number', t => {
  t.plan(1)
  const SR = normalizeSR(102100)
  t.equal(SR.wkid, 3857)
})

test('normalize SR with a State Plane wkt', t => {
  t.plan(1)
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
  UNIT["Foot_US",0.30480060960121924],
  AUTHORITY["EPSG","102645"]]`
  const SR = normalizeSR({ wkt })
  t.equal(SR.wkt, wkt)
})

test('normalize input SR with geometry.wkt string', t => {
  t.plan(1)
  const options = {
    geometry: {
      spatialReference: {
        wkt: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
      }
    }
  }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:3857`)
})

test('normalize input SR with geometry.latestWkid', t => {
  t.plan(1)
  const options = { geometry: { spatialReference: { latestWkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:4269`)
})

test('normalize input SR with geometry.wkid', t => {
  t.plan(1)
  const options = { geometry: { spatialReference: { wkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:4269`)
})

test('normalize input SR with inSR string', t => {
  t.plan(1)
  const options = { inSR: '4269' }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:4269`)
})

test('normalize input SR with undefined inSR', t => {
  t.plan(1)
  const options = { }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:4326`)
})

test('normalize input SR with inSR={ }', t => {
  t.plan(1)
  const options = { inSR: { } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:4326`)
})

test('normalize input SR with  bogus inSR={wkid:9999}, default to 4326', t => {
  t.plan(1)
  const options = { inSR: { wkid: 9999 } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, `EPSG:4326`)
})

test('normalize source data SR with sourceSR string', t => {
  t.plan(1)
  const sourceSR = normalizeSourceSR('4269')
  t.equal(sourceSR, `EPSG:4269`)
})

test('normalize source data SR with undefined sourceSR', t => {
  t.plan(1)
  const options = { }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, `EPSG:4326`)
})

test('normalize source data SR with sourceSR={ }', t => {
  t.plan(1)
  const options = { inSR: { } }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, `EPSG:4326`)
})

test('normalize source data SR with unknown wkid, default to 4326', t => {
  t.plan(1)
  const options = { inSR: { wkid: 9999 } }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, `EPSG:4326`)
})
