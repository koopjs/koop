const test = require('tape')
const Winnow = require('../..')
const trees = require('./fixtures/trees.json')
const trees102645 = require('./fixtures/trees-sr-102645.json')
const caStatePlaneWKT = `PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",
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

test('compiling a complex query', t => {
  try {
    t.ok(Winnow.prepareQuery({
      geometry: {
        xmin: -37237674.195623085,
        ymin: 676003.5082798181,
        xmax: 37237674.195623085,
        ymax: 12416731.052879848,
        spatialReference: {
          wkt: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
        }
      }
    }), 'query compiled')
    t.end()
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('compiling with several and statements', t => {
  try {
    t.ok(Winnow.prepareQuery({ where: 'ELEVATION >= 1165 AND ELEVATION <= 4365 AND POP1990 >= 8247 AND POP1990 <= 5700236' }))
    t.end()
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('prepare query with where, then execute filter', (t) => {
  t.plan(1)
  const options = {
    where: 'Common_Name=\'SOUTHERN MAGNOLIA\''
  }
  const query = Winnow.prepareQuery(options)
  const filtered = query(trees)
  t.equal(filtered.features.length, 6)
})

test('prepare query with geometry filter, then execute filter', (t) => {
  t.plan(1)
  const options = {
    geometry: {
      xmin: -118.1406,
      ymin: 34.1635,
      xmax: -118.1348,
      ymax: 34.1685,
      spatialReference: {
        wkid: 4326
      }
    }
  }
  const query = Winnow.prepareQuery(options)
  const filtered = query(trees)
  t.equal(filtered.features.length, 6)
})

test('prepare query with geometry filter and projection, then execute filter', (t) => {
  t.plan(3)
  const options = {
    geometry: {
      xmin: -118.1406,
      ymin: 34.1635,
      xmax: -118.1348,
      ymax: 34.1685,
      spatialReference: {
        wkid: 4326
      }
    },
    projection: 3857
  }
  const query = Winnow.prepareQuery(options)
  const filtered = query(trees)
  t.equal(filtered.features.length, 6)
  t.equal(filtered.features[0].geometry.coordinates[0], -13151163.395368768)
  t.equal(filtered.features[0].geometry.coordinates[1], 4051225.3197446787)
})

test('prepare query with geometry filter and sourceSR, then execute filter on non-4326 source data', (t) => {
  t.plan(3)
  const options = {
    geometry: {
      xmin: -118.15738230943678,
      ymin: 34.179713563470166,
      xmax: -118.15718114376067,
      ymax: 34.18019950919287,
      spatialReference: {
        wkid: 4326
      }
    },
    sourceSR: caStatePlaneWKT
  }
  const query = Winnow.prepareQuery(options)
  const filtered = query(trees102645)
  t.equal(filtered.features.length, 3)
  t.equal(filtered.features[0].geometry.coordinates[0], 6514083.848741564)
  t.equal(filtered.features[0].geometry.coordinates[1], 1887939.4934484742)
})
