'use strict'
const _ = require('lodash')
const test = require('tape')
const winnow = require('../..')

test('With a where option', t => {
  const options = {
    where: "Genus like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With a where options 1=1', t => {
  const options = {
    where: '1=1'
  }
  run('trees_subset', options, 24, t)
})

test('With a where option with multiple statements', t => {
  const options = {
    where: "Genus like '%Quercus%' AND Street_Name = 'CLAREMONT' AND House_Number < 600 AND Trunk_Diameter = 9"
  }
  run('trees', options, 1, t)
})

test('With a where option with multiple statements with appended 1=1', t => {
  const options = {
    where: "Genus like '%Quercus%' AND Street_Name = 'CLAREMONT' AND House_Number < 600 AND Trunk_Diameter = 9 AND 1=1"
  }
  run('trees', options, 1, t)
})

test('With a field that has been uppercased', t => {
  const options = {
    where: "UPPER(Genus) like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With the toEsri option', t => {
  const options = {
    toEsri: true,
    where: "Genus like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With the toEsri option and a null geometry', t => {
  const options = {
    toEsri: true
  }
  run('nogeom', options, 100, t)
})

test('With a field with a space', t => {
  const options = {
    where: '"total precip" > 1'
  }
  run('snow', options, 4, t)
})

test('With esri json', t => {
  const options = {
    where: "Genus like '%Quercus%'",
    esri: true
  }
  run('esri', options, 267, t)
})

test('With multiple like clauses', t => {
  const options = {
    where: "Genus like '%Quercus%' AND Common_Name like '%Live Oak%' AND Street_Type like '%AVE%'"
  }
  run('trees', options, 3330, t)
})

test('With an in parameter', t => {
  const options = {
    where: "Genus IN ('QUERCUS', 'EUGENIA')"
  }
  run('trees', options, 13134, t)
})

test('With an is parameter', t => {
  const options = {
    where: 'Species IS NULL'
  }
  run('trees', options, 2872, t)
})

test('With two is and one and parameters', t => {
  const options = {
    where: 'Genus IS NULL AND Street_Direction IS NOT NULL'
  }
  run('trees', options, 22, t)
})

test('With an > parameter', t => {
  const options = {
    where: 'Trunk_Diameter>10'
  }
  run('trees', options, 35961, t)
})

test('With an >= parameter', t => {
  const options = {
    where: 'Trunk_Diameter>=10'
  }
  run('trees', options, 37777, t)
})

test('With an in parameter and a numeric test', t => {
  const options = {
    where: "Genus IN ('QUERCUS', 'EUGENIA') AND Trunk_Diameter=10"
  }
  run('trees', options, 409, t)
})

test('With an AND and an OR', t => {
  const options = {
    where: "(Genus like '%Quercus%' AND Common_Name like '%Live Oak%') OR Street_Type like '%AVE%'"
  }
  run('trees', options, 31533, t)
})

test('With an equality parameter', t => {
  const options = {
    where: "Common_Name = 'LIVE OAK'"
  }
  run('trees', options, 6498, t)
})

test('With date inputs', t => {
  const options = {
    where: "Date1 >= '2012-03-14T04:00:00.000Z' AND Date1 <= '2012-03-18T03:59:59.000Z'"
  }
  run('dates', options, 3, t)
})

test('With an esri style envelope', t => {
  const options = {
    geometry: {
      xmin: -13155799.066536672,
      ymin: 4047806.77771083,
      xmax: -13143569.142011061,
      ymax: 4050673.16627152,
      spatialReference: {
        wkid: 102100
      }
    }
  }
  const fixtures = _.cloneDeep(require('./fixtures/trees.json'))
  const features = fixtures.features
  const filtered = winnow.query(features, options)
  t.equal(filtered.length, 29744)
  t.end()
})

test('With an esri style envelope and features with missing geometry', t => {
  const options = {
    outSr: 4326,
    inSr: 4326,
    geometry: {
      xmin: 0,
      ymin: 40,
      xmax: 90,
      ymax: 85,
      spatialReference: {
        wkid: 4326
      }
    },
    esri: true
  }
  run('missing-geometry', options, 2, t)
})

test('With an esri style envelope and wkt string for web mercator', t => {
  const options = {
    geometry: {
      xmin: -13155799.066536672,
      ymin: 4047806.77771083,
      xmax: -13143569.142011061,
      ymax: 4050673.16627152,
      spatialReference: {
        wkt:
          'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-97.03124999997486],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
      }
    }
  }
  run('trees', options, 29744, t)
})

test('With an empty multipolygon', t => {
  const options = {
    geometry: {
      xmin: -8968940.494006854,
      ymin: 2943609.5726516787,
      xmax: -8944480.644955631,
      ymax: 2949342.3497730596,
      spatialReference: {
        wkid: 102100
      }
    }
  }
  run('emptyMultiPolygon', options, 1, t)
})

test('Without a spatialReference property on an Esri-style Envelope', t => {
  const options = {
    geometry: {
      xmin: -118.18055376275225,
      ymin: 34.14141744789609,
      xmax: -118.07069048150241,
      ymax: 34.162726215637875
    }
  }
  run('trees', options, 29744, t)
})

test('With an esri style envelope with xmin = 0, ans esri features', t => {
  const options = {
    outSr: 4326,
    inSr: 4326,
    geometry: {
      xmin: 0,
      ymin: 40,
      xmax: 90,
      ymax: 85,
      spatialReference: {
        wkid: 4326
      }
    },
    esri: true
  }
  run('startups', options, 2, t)
})

test('With an esri style envelope in EPSG:102645 defined by wkt', t => {
  const options = {
    geometry: {
      xmin: 6514066.3001615712419152,
      ymin: 1887820.5006760144606233,
      xmax: 6514127.4193187793716788,
      ymax: 1887997.4401315276045352,
      spatialReference: {
        wkt: `PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",
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
      }
    },
    esri: true
  }
  run('trees', options, 4, t)
})

test('With a an Esri-style Polygon', t => {
  const options = {
    geometry: {
      rings: [
        [
          [-12993071.816030473, 3913575.8482084945],
          [-12836528.782102507, 3913575.8482084945],
          [-12836528.782102507, 4070118.8821364585],
          [-12993071.816030473, 4070118.8821364585],
          [-12993071.816030473, 3913575.8482084945]
        ]
      ]
    },
    inSR: 102100
  }
  run('restaurants', options, 249, t)
})

test('With an array-style geometry', t => {
  const options = {
    geometry: [-118.18055376275225, 34.14141744789609, -118.07069048150241, 34.162726215637875]
  }
  run('trees', options, 29744, t)
})

test('With a string-style geometry', t => {
  const options = {
    geometry: '-118.18055376275225, 34.14141744789609, -118.07069048150241, 34.162726215637875'
  }
  run('trees', options, 29744, t)
})

test('With a ST_Contains geometry predicate', t => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    },
    spatialPredicate: 'ST_Contains'
  }
  run('trees', options, 9878, t)
})

test('With a ST_Within geometry predicate', t => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    },
    spatialPredicate: 'ST_Within'
  }
  run('trees', options, 9878, t)
})

test('With a ST_EnvelopeIntersects geometry predicate', t => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[-128, 29], [-108, 29], [-108, 50], [-128, 50], [-128, 29]]
      ]
    },
    spatialPredicate: 'ST_EnvelopeIntersects'
  }
  run('states', options, 11, t)
})

test('With a ST_Intersects geometry predicate', t => {
  const options = {
    geometry: {
      type: 'LineString',
      coordinates: [[-85.983201784023521, 34.515410848143297, 204.5451898127248], [-121.278821256198796, 39.823566607727578, 1173.189682061974963]]
    },
    spatialPredicate: 'ST_Intersects'
  }
  run('states', options, 9, t)
})

test('With a where and a geometry option', t => {
  const options = {
    where: "Genus like '%Quercus%'",
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    }
  }
  run('trees', options, 2315, t)
})

test('With a where, geometry, limit and offset option', t => {
  t.plan(5)
  const data = 'trees'
  const options = {
    where: "Genus like '%Quercus%'",
    geometry: {
      type: 'Polygon',
      coordinates: [[[-118.163, 34.162], [-118.108, 34.162], [-118.108, 34.173], [-118.163, 34.173], [-118.163, 34.162]]]
    },
    limit: 4,
    offset: 1
  }
  const features = require(`./fixtures/${data}.json`).features
  const filtered = winnow.query(features, options)
  t.equal(filtered.length, 4)
  t.equal(filtered[0].properties.Common_Name, 'LIVE OAK')
  t.equal(filtered[0].properties.Trunk_Diameter, 1)
  t.equal(filtered[3].properties.Common_Name, 'LIVE OAK')
  t.equal(filtered[3].properties.Trunk_Diameter, 18)
})

test('With an envelope, an inSR and an outSR', t => {
  const options = {
    f: 'json',
    returnGeometry: true,
    spatialRel: 'esriSpatialRelIntersects',
    geometry: {
      xmin: -8570731.10757695,
      ymin: 4710966.9272944275,
      xmax: -8565839.137766706,
      ymax: 4715858.897104671,
      spatialReference: {
        wkid: 102100,
        latestWkid: 3857
      }
    },
    geometryType: 'esriGeometryEnvelope',
    inSR: 102100,
    outFields: '*',
    outSR: 102100
  }
  run('apartments', options, 24, t)
})

test('With a multi-ring geometry and an inSR', t => {
  const options = {
    geometry: {
      rings: [
        [
          [19930537.269606635, -1018885.7633881811],
          [19930537.269606635, 13148258.807095852],
          [20037508.342788905, 13148258.807095852],
          [20037508.342788905, -1018885.7633881811],
          [19930537.269606635, -1018885.7633881811]
        ],
        [
          [-20037508.342788905, -1018885.7633881811],
          [-20037508.342788905, 13148258.807095852],
          [-4568447.54013514, 13148258.807095852],
          [-4568447.54013514, -1018885.7633881811],
          [-20037508.342788905, -1018885.7633881811]
        ]
      ]
    },
    geometryType: 'esriGeometryPolygon',
    inSR: 102100
  }
  run('ringbug', options, 30, t)
})

test('with a coded value domain', t => {
  const options = {
    where: "State = '1'",
    esriFields: [
      {
        name: 'State',
        type: 'esriFieldTypeString',
        alias: 'State',
        sqlType: 'sqlTypeOther',
        length: 50,
        nullable: true,
        editable: true,
        domain: {
          type: 'codedValue',
          name: 'State',
          codedValues: [
            {
              name: 'Virginia',
              code: '1'
            },
            {
              name: 'Maryland',
              code: '2'
            }
          ]
        },
        defaultValue: null
      }
    ]
  }
  run('cvd', options, 2, t)
})

test('with a numeric coded value domain', t => {
  const options = {
    where: 'State = 1',
    esriFields: [
      {
        name: 'State',
        type: 'esriFieldTypeString',
        alias: 'State',
        sqlType: 'sqlTypeOther',
        length: 50,
        nullable: true,
        editable: true,
        domain: {
          type: 'codedValue',
          name: 'State',
          codedValues: [
            {
              name: 'Virginia',
              code: 1
            },
            {
              name: 'Maryland',
              code: 2
            }
          ]
        },
        defaultValue: null
      }
    ]
  }
  run('cvd', options, 2, t)
})

test('with a coded value domain', t => {
  const options = {
    where: "ZONING_S = 'INST'",
    esriFields: require('./fixtures/esriFields.json')
  }
  run('cvd2', options, 10, t)
})

test('with a date query', t => {
  const options = {
    where: 'ISSUE_DATE >= date 2017-01-05'
  }
  run('permits', options, 211, t)
})

test('with an esri-style date query', t => {
  const options = {
    where: "ISSUE_DATE >= '2017-01-05T00:00:00.000Z' AND ISSUE_DATE <= '2017-04-08T23:59:59.000Z'"
  }
  run('permits', options, 211, t)
})

test('with a timestamp query', t => {
  const options = {
    where: "ISSUE_DATE >= timestamp '2017-01-05'"
  }
  run('permits', options, 211, t)
})

test('with a between query', t => {
  const options = {
    where: "ISSUE_DATE between timestamp '2017-01-05T00:00:00.000Z' AND timestamp '2017-04-08T23:59:59.000Z'"
  }
  run('permits', options, 211, t)
})

test('with a OBJECTID query on data that requires dynamic OBJECTID generation', t => {
  t.plan(1)
  const options = {
    where: 'OBJECTID=1138516379',
    toEsri: true
  }
  const fixtures = _.cloneDeep(require('./fixtures/snow.json'))
  const filtered = winnow.query(fixtures, options)
  t.equal(filtered.features.length, 1)
})

test('with null dates in data source', t => {
  // Ensure null dates are returned as null, not as 0
  // Bug only occurs when:
  // * 'toEsri' option enabled
  // * the geojson is passed to winnow.query with the metadata.fields populated
  const options = {
    where: "Date1 >= '2020-01-05 00:00:00' AND Date1 <= '2020-02-08 23:59:59'",
    toEsri: true
  }
  t.plan(4)
  const fixtures = _.cloneDeep(require('./fixtures/dates.json'))
  const filtered = winnow.query(fixtures, options)

  t.equal(filtered.features.length, 1)
  const feature = filtered.features[0]
  t.equal(feature.attributes.Date4, null)
  t.equal(feature.attributes.Date5, null)
  t.equal(feature.attributes.Date6, null)
})

function run (data, options, expected, t) {
  t.plan(1)
  const fixtures = _.cloneDeep(require(`./fixtures/${data}.json`))
  const features = fixtures.features
  const filtered = winnow.query(features, options)
  t.equal(filtered.length, expected)
}
