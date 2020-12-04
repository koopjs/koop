const test = require('tape')
const _ = require('lodash')
const winnow = require('../..')
const features = require('./fixtures/snow.json').features
const geojson102645 = require('./fixtures/trees-sr-102645.json')
const polygonFeatures = require('./fixtures/polygon.json').features
const multiPolyFeatures = require('./fixtures/multipolygon.json').features

test('Project to Web Mercator using 3857', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
  t.equal(results[0].geometry.spatialReference, undefined)
})

test('Project to Web Mercator using 3857 and reduce the precision', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    limit: 1,
    geometryPrecision: 3
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.392, 4857924.005])
  t.equal(results[0].geometry.spatialReference, undefined)
})

test('Project to Web Mercator using 3857 and translating to esri', t => {
  t.plan(3)
  const options = {
    projection: 3857,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(features, options)
  t.equal(results.length, 1)
  t.equal(results[0].geometry.x, -11682713.391976157)
  t.equal(results[0].geometry.y, 4857924.005275469)
})

test('Project a polygon to Web Mercator using 3857 and translating to esri', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(polygonFeatures, options)

  t.equal(results.length, 1)
  t.deepEqual(results[0].geometry.rings, [
    [
      [-13247454.246160466, 6496535.908013698],
      [-11408073.597505985, 6985732.8890388245],
      [-9216471.12251341, 4813698.293287256],
      [-10214432.963804673, 3874440.0897190133],
      [-12934368.178304385, 3424378.867175897],
      [-13247454.246160466, 6496535.908013698]
    ]
  ])
})

test('Project a multi-polygon to Web Mercator using 3857 and translating to esri', t => {
  t.plan(3)
  const options = {
    projection: 3857,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(multiPolyFeatures, options)

  t.equal(results.length, 1)
  const expected = [
    [-13247454.246160466, 6496535.908013698],
    [-11408073.597505985, 6985732.8890388245],
    [-9216471.12251341, 4813698.293287256],
    [-10214432.963804673, 3874440.0897190133],
    [-12934368.178304385, 3424378.867175897],
    [-13247454.246160466, 6496535.908013698]
  ]
  t.deepEqual(results[0].geometry.rings[0][0], expected[0])
  t.deepEqual(results[0].geometry.rings[1][0], expected[0])
})

test('Project to Web Mercator using 3857 with an esri style outSR', t => {
  t.plan(1)
  const options = {
    outSR: { latestWkid: 3857 },
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using 102100 when outSR is just a number', t => {
  t.plan(2)
  const options = {
    outSR: 102100,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(features, options)
  t.equal(results[0].geometry.x, -11682713.391976157)
  t.equal(results[0].geometry.y, 4857924.005275469)
})

test('Project to Web Mercator using 3857 with a geo filter', t => {
  t.plan(1)
  const options = {
    projection: 3857,
    limit: 1,
    geometry: {
      xmin: -20026376.39,
      ymin: -20048966.1,
      xmax: 20026376.39,
      ymax: 20048966.1,
      spatialReference: {
        wkid: 102100
      }
    }
  }

  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using 102100', t => {
  t.plan(1)
  const options = {
    projection: 102100,
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Project to Web Mercator using WKT', t => {
  t.plan(1)
  const options = {
    projection:
      'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.017453292519943295]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]',
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-11682713.391976157, 4857924.005275469])
})

test('Do not project NaN coordinate values', t => {
  t.plan(2)
  const options = {
    projection: 3857
  }
  const modifiedFeatures = _.cloneDeep(features)
  modifiedFeatures[0].geometry.coordinates[0] = null
  modifiedFeatures[0].geometry.coordinates[1] = null
  const results = winnow.query(modifiedFeatures, options)
  t.equal(results.length, 13)
  t.deepEqual(results[0].geometry.coordinates, [null, null])
})

test('Project to NAD83 4269 an esri style outSR', t => {
  t.plan(1)
  const options = {
    outSR: { latestWkid: 4269 },
    limit: 1
  }
  const results = winnow.query(features, options)
  t.deepEqual(results[0].geometry.coordinates, [-104.9476, 39.9448])
})

test('Project a polygon to NAD83 using 4269', t => {
  t.plan(2)
  const options = {
    projection: 4269,
    limit: 1
  }
  const results = winnow.query(polygonFeatures, options)

  t.equal(results.length, 1)
  t.deepEqual(results[0].geometry.coordinates, [
    [
      [-119.00390625, 50.28933925329178],
      [-116.19140625, 29.38217507514529],
      [-91.7578125, 32.84267363195431],
      [-82.79296874999999, 39.639537564366684],
      [-102.48046875, 53.014783245859206],
      [-119.00390625, 50.28933925329178]
    ]
  ])
})

test('Project a polygon to NAD83 using 4269 and translating to esri', t => {
  t.plan(2)
  const options = {
    projection: 4269,
    limit: 1,
    toEsri: true
  }
  const results = winnow.query(polygonFeatures, options)
  t.equal(results.length, 1)
  t.deepEqual(results[0].geometry.rings, [
    [
      [-119.00390625, 50.28933925329178],
      [-102.48046875, 53.014783245859206],
      [-82.79296874999999, 39.639537564366684],
      [-91.7578125, 32.84267363195431],
      [-116.19140625, 29.38217507514529],
      [-119.00390625, 50.28933925329178]
    ]
  ])
})

test('Project data with CRS 102645 to 3857 using wkt', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    inputCrs: `PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",
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
AUTHORITY["EPSG","102645"]]`,
    limit: 1
  }
  const { crs, features: [feature] } = winnow.query(geojson102645, options)
  t.deepEqual(feature.geometry, {
    type: 'Point',
    coordinates: [
      -13153229.775672015,
      4053009.002177773
    ]
  })
  t.deepEquals(crs, { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3857' } })
})

test('Project data with CRS 102645 to 3857 using wkid', t => {
  t.plan(2)
  const options = {
    projection: 3857,
    inputCrs: 102645,
    limit: 1
  }
  const { crs, features: [feature] } = winnow.query(geojson102645, options)
  t.deepEqual(feature.geometry, {
    type: 'Point',
    coordinates: [
      -13153229.775672015,
      4053009.002177773
    ]
  })
  t.deepEquals(crs, { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3857' } })
})

test('Project data with CRS 102645 to 2285 using wkid', t => {
  t.plan(2)
  const options = {
    projection: 2285,
    inputCrs: 102645,
    limit: 1
  }
  const { crs, features: [feature] } = winnow.query(geojson102645, options)

  t.deepEqual(feature.geometry, {
    type: 'Point',
    coordinates: [2472082.3119989717, -4703451.5519728195]
  })
  t.deepEquals(crs, { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::2285' } })
})

test('Project data with CRS 102645 to 3857, use geometry filter with WGS84', t => {
  t.plan(3)
  const options = {
    projection: 3857,
    inputCrs: 102645,
    geometry: {
      xmin: -118.1574890535315,
      ymin: 34.180075683064324,
      xmax: -118.15745575823779,
      ymax: 34.18010065453462,
      spatialReference: {
        wkid: 4326
      }
    }
  }
  const { crs, features } = winnow.query(geojson102645, options)
  t.equals(features.length, 1)
  t.deepEqual(features[0].geometry, {
    type: 'Point',
    coordinates: [
      -13153229.775672015,
      4053009.002177773
    ]
  })
  t.deepEquals(crs, { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3857' } })
})

test('Project data with CRS 102645 to 3857, use geometry filter with 102645', t => {
  t.plan(3)
  const options = {
    projection: 3857,
    inputCrs: 102645,
    geometry: {
      xmin: 6514034.222058748,
      ymin: 1887952.412400938,
      xmax: 6514044.291980494,
      ymax: 1887961.5157372837,
      spatialReference: {
        wkid: 102645
      }
    }
  }
  const { crs, features } = winnow.query(geojson102645, options)
  t.equals(features.length, 1)
  t.deepEqual(features[0].geometry, {
    type: 'Point',
    coordinates: [
      -13153229.775672015,
      4053009.002177773
    ]
  })
  t.deepEquals(crs, { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3857' } })
})
