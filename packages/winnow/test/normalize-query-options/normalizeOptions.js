const test = require('tape')

const {
  // TODO: Put these under test
  // normalizeDateFields,
  // normalizeSpatialPredicate,
  // normalizeLimit,
  // normalizeGeometry,
  // normalizeOffset,
  // normalizeProjection,
  normalizeSR,
  normalizeInSR,
  normalizeSourceSR,
  normalizeIdField
} = require('../../lib/normalize-query-options/normalizeOptions')

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

test('normalize SR with the old 102100 number', t => {
  t.plan(1)
  const SR = normalizeSR(102100)
  t.equal(SR.wkid, 3857)
})

test('normalize SR wkid 2855 with wkt - uses @esri/proj-codes', t => {
  t.plan(1)
  const SR = normalizeSR(2855)
  t.equal(SR.wkt, 'PROJCS["NAD_1983_HARN_StatePlane_Washington_North_FIPS_4601",GEOGCS["GCS_North_American_1983_HARN",DATUM["D_North_American_1983_HARN",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-120.8333333333333],PARAMETER["Standard_Parallel_1",47.5],PARAMETER["Standard_Parallel_2",48.73333333333333],PARAMETER["Latitude_Of_Origin",47.0],UNIT["Meter",1.0]]')
})

test('normalize SR wkid 102645 with wkt, still uses @esri/proj-codes', t => {
  t.plan(1)
  const SR = normalizeSR(102645)
  t.equal(SR.wkt, 'PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",6561666.666666666],PARAMETER["False_Northing",1640416.666666667],PARAMETER["Central_Meridian",-118.0],PARAMETER["Standard_Parallel_1",34.03333333333333],PARAMETER["Standard_Parallel_2",35.46666666666667],PARAMETER["Latitude_Of_Origin",33.5],UNIT["Foot_US",0.3048006096012192]]')
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
  t.equal(inSR, 'EPSG:3857')
})

test('normalize input SR with geometry.latestWkid', t => {
  t.plan(1)
  const options = { geometry: { spatialReference: { latestWkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with geometry.wkid', t => {
  t.plan(1)
  const options = { geometry: { spatialReference: { wkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with inSR string', t => {
  t.plan(1)
  const options = { inSR: '4269' }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with undefined inSR', t => {
  t.plan(1)
  const options = { }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize input SR with inSR={ }', t => {
  t.plan(1)
  const options = { inSR: { } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize input SR with  bogus inSR={wkid:9999}, default to 4326', t => {
  t.plan(1)
  const options = { inSR: { wkid: 9999 } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize source data SR with sourceSR string', t => {
  t.plan(1)
  const sourceSR = normalizeSourceSR('4269')
  t.equal(sourceSR, 'EPSG:4269')
})

test('normalize source data SR with undefined sourceSR', t => {
  t.plan(1)
  const options = { }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, 'EPSG:4326')
})

test('normalize source data SR with sourceSR={ }', t => {
  t.plan(1)
  const options = { inSR: { } }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, 'EPSG:4326')
})

test('normalize source data SR with unknown wkid, default to 4326', t => {
  t.plan(1)
  const options = { inSR: { wkid: 9999 } }
  const sourceSR = normalizeInSR(options)
  t.equal(sourceSR, 'EPSG:4326')
})

test('normalize idField when set with metadata', t => {
  t.plan(1)
  const options = { collection: { metadata: { idField: 'feature_id' } } }
  const idField = normalizeIdField(options)
  t.equals(idField, 'feature_id', 'idField set properly with metadata')
})

test('normalize idField with OBJECTID from feature properties', t => {
  t.plan(1)
  const options = {}
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found as feature property')
})

test('normalize idField with metadata.fields', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        fields: [
          {
            name: 'OBJECTID'
          }
        ]
      }
    }
  }
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found in metadata.fields')
})

test('normalize idField with metadata.fields', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        fields: [
          {
            name: 'OBJECTID'
          }
        ]
      }
    }
  }
  const features = [
    {
      properties: {
        OBJECTID: 1
      }
    }
  ]
  const idField = normalizeIdField(options, features)
  t.equals(idField, 'OBJECTID', 'idField defaulted to OBJECTID when found in metadata.fields')
})

test('normalize idField with metadata.idField = null', t => {
  t.plan(1)
  const options = {
    collection: {
      metadata: {
        idField: null
      }
    }
  }
  const idField = normalizeIdField(options)
  t.equals(idField, null, 'idField return as null')
})
