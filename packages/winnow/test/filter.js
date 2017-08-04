'use strict'
const test = require('tape')
const winnow = require('../src')

test('With a where option', t => {
  const options = {
    where: "Genus like '%Quercus%'"
  }
  run('trees', options, 12105, t)
})

test('With a where option with multiple statements', t => {
  const options = {
    where: "Genus like '%Quercus%' AND Street_Name = 'CLAREMONT' AND House_Number < 600 AND Trunk_Diameter = 9"
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
  run('trees', options, 29744, t)
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
  run('states', options, 1, t)
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

function run (data, options, expected, t) {
  t.plan(1)
  const features = require(`./fixtures/${data}.json`).features
  const filtered = winnow.query(features, options)
  t.equal(filtered.length, expected)
}
