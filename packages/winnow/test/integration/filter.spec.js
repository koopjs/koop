const _ = require('lodash');
const test = require('tape');
const winnow = require('../..');

test('With a where option', (t) => {
  const options = {
    where: 'Genus like \'%Quercus%\'',
  };
  run('trees', options, 8, t);
});

test('With a where options 1=1', (t) => {
  const options = {
    where: '1=1',
  };
  run('trees', options, 24, t);
});

test('With a where option with multiple statements', (t) => {
  const options = {
    where:
      'Genus like \'%Quercus%\' AND Street_Name = \'CLAREMONT\' AND House_Number < 600 AND Trunk_Diameter = 9',
  };
  run('trees', options, 1, t);
});

test('With a where option with multiple statements with appended 1=1', (t) => {
  const options = {
    where:
      'Genus like \'%Quercus%\' AND Street_Name = \'CLAREMONT\' AND House_Number < 600 AND Trunk_Diameter = 9 AND 1=1',
  };
  run('trees', options, 1, t);
});

test('With a field that has been uppercased', (t) => {
  const options = {
    where: 'UPPER(Genus) like \'%Quercus%\'',
  };
  t.plan(1);
  const fixtures = _.cloneDeep(require('./fixtures/trees.json'));
  const features = fixtures.features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, 8);
});

test('With the toEsri option', (t) => {
  const options = {
    toEsri: true,
    where: 'Genus like \'%Quercus%\'',
  };
  run('trees', options, 8, t);
});

test('With the toEsri option and a null geometry', (t) => {
  const options = {
    toEsri: true,
  };
  run('nogeom', options, 18, t);
});

test('With a field with a space', (t) => {
  const options = {
    where: '"total precip" > 0.5',
  };
  t.plan(1);
  const fixtures = _.cloneDeep(require('./fixtures/snow.json'));
  const features = fixtures.features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, 3);
});

test('With esri json', (t) => {
  const options = {
    where: 'Genus like \'%Quercus%\'',
    esri: true,
  };
  run('esri', options, 8, t);
});

test('With multiple like clauses', (t) => {
  const options = {
    where:
      'Genus like \'%Quercus%\' AND Common_Name like \'%Live Oak%\' AND Street_Type like \'%ST%\'',
  };
  run('trees', options, 5, t);
});

test('With an in parameter', (t) => {
  const options = {
    where: 'Genus IN (\'QUERCUS\', \'EUGENIA\')',
  };
  run('trees', options, 8, t);
});

test('With an is parameter', (t) => {
  const options = {
    where: 'Species IS NULL',
  };
  run('trees', options, 1, t);
});

test('With two is and one and parameters', (t) => {
  const options = {
    where: 'Species IS NULL AND Street_Direction IS NOT NULL',
  };
  run('trees', options, 1, t);
});

test('With an > parameter', (t) => {
  const options = {
    where: 'Trunk_Diameter>10',
  };
  run('trees', options, 12, t);
});

test('With an >= parameter', (t) => {
  const options = {
    where: 'Trunk_Diameter>=10',
  };
  run('trees', options, 12, t);
});

test('With an IN parameter and a numeric test', (t) => {
  const options = {
    where: 'Genus IN (\'QUERCUS\', \'JACARANDA\') AND Trunk_Diameter>=13',
  };
  run('trees', options, 6, t);
});

test('With an AND and an OR', (t) => {
  const options = {
    where:
      '(Genus like \'%Quercus%\' AND Common_Name like \'%Live Oak%\') OR Street_Type like \'%AVE%\'',
  };
  run('trees', options, 13, t);
});

test('With an equality parameter', (t) => {
  const options = {
    where: 'Common_Name = \'LIVE OAK\'',
  };
  run('trees', options, 6, t);
});

test('With an esri style envelope', (t) => {
  const options = {
    geometry: {
      xmin: -13151597,
      ymin: 4050894,
      xmax: -13150342,
      ymax: 4051582,
      spatialReference: {
        wkid: 102100,
      },
    },
  };
  const fixtures = _.cloneDeep(require('./fixtures/trees.json'));
  const features = fixtures.features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, 6);
  t.end();
});

test('With an esri style envelope and features with missing geometry', (t) => {
  const options = {
    outSr: 4326,
    inSr: 4326,
    geometry: {
      xmin: 0,
      ymin: 40,
      xmax: 90,
      ymax: 85,
      spatialReference: {
        wkid: 4326,
      },
    },
    esri: true,
  };
  run('missing-geometry', options, 2, t);
});

test('With an esri style envelope and wkt string for web mercator', (t) => {
  const options = {
    geometry: {
      xmin: -13151597,
      ymin: 4050894,
      xmax: -13150342,
      ymax: 4051582,
      spatialReference: {
        wkt: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-97.03124999997486],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]',
      },
    },
  };
  run('trees', options, 6, t);
});

test('With an empty multipolygon', (t) => {
  const options = {
    geometry: {
      xmin: -8968940.494006854,
      ymin: 2943609.5726516787,
      xmax: -8944480.644955631,
      ymax: 2949342.3497730596,
      spatialReference: {
        wkid: 102100,
      },
    },
  };
  run('emptyMultiPolygon', options, 1, t);
});

test('Without a spatialReference property on an Esri-style Envelope', (t) => {
  const options = {
    geometry: {
      xmin: -118.1406,
      ymin: 34.1635,
      xmax: -118.1348,
      ymax: 34.1685,
    },
  };
  run('trees', options, 6, t);
});

test('With an esri style envelope with xmin = 0, ans esri features', (t) => {
  const options = {
    outSr: 4326,
    inSr: 4326,
    geometry: {
      xmin: 0,
      ymin: 40,
      xmax: 90,
      ymax: 85,
      spatialReference: {
        wkid: 4326,
      },
    },
    esri: true,
  };
  run('startups', options, 2, t);
});

test('With an esri style envelope in EPSG:102645 defined by wkt', (t) => {
  const options = {
    geometry: {
      xmin: 6518475,
      ymin: 1881600,
      xmax: 6521000,
      ymax: 1883700,
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
        AUTHORITY["EPSG","102645"]]`,
      },
    },
    esri: true,
  };
  run('trees', options, 6, t);
});

test('With a an Esri-style Polygon', (t) => {
  const options = {
    geometry: {
      rings: [
        [
          [-118.163, 34.162],
          [-118.108, 34.162],
          [-118.108, 34.173],
          [-118.163, 34.173],
          [-118.163, 34.162],
        ],
      ],
    },
    inSR: 4326,
  };
  run('trees', options, 12, t);
});

test('With an array-style geometry', (t) => {
  const options = {
    geometry: [-118.1406, 34.1635, -118.1348, 34.1685],
  };
  run('trees', options, 6, t);
});

test('With a string-style geometry', (t) => {
  const options = {
    geometry: '-118.1406, 34.1635, -118.1348, 34.1685',
  };
  run('trees', options, 6, t);
});

test('With a point geometry filter', (t) => {
  const options = {
    geometry: '-118.16230746759626,34.137113646321595',
  };
  run('trees', options, 1, t);
});

test('With a ST_Contains geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-118.163, 34.162],
          [-118.108, 34.162],
          [-118.108, 34.173],
          [-118.163, 34.173],
          [-118.163, 34.162],
        ],
      ],
    },
    spatialPredicate: 'ST_Contains',
  };
  run('trees', options, 12, t);
});

test('With a ST_Within geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-118.163, 34.162],
          [-118.108, 34.162],
          [-118.108, 34.173],
          [-118.163, 34.173],
          [-118.163, 34.162],
        ],
      ],
    },
    spatialPredicate: 'ST_Within',
  };
  run('trees', options, 12, t);
});

test('With a ST_EnvelopeIntersects geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-128, 29],
          [-108, 29],
          [-108, 50],
          [-128, 50],
          [-128, 29],
        ],
      ],
    },
    spatialPredicate: 'ST_EnvelopeIntersects',
  };
  run('states', options, 2, t);
});

test('With a ST_Intersects geometry predicate', (t) => {
  const options = {
    geometry: {
      type: 'LineString',
      coordinates: [
        [-85.983201784023521, 34.515410848143297, 204.5451898127248],
        [-121.278821256198796, 39.823566607727578, 1173.189682061974963],
      ],
    },
    spatialPredicate: 'ST_Intersects',
  };
  run('states', options, 1, t);
});

test('With a where and a geometry option', (t) => {
  const options = {
    where: 'Genus like \'%Quercus%\'',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-118.163, 34.162],
          [-118.108, 34.162],
          [-118.108, 34.173],
          [-118.163, 34.173],
          [-118.163, 34.162],
        ],
      ],
    },
  };
  run('trees', options, 5, t);
});

test('With a where, geometry, limit and offset option', (t) => {
  t.plan(5);
  const data = 'trees';
  const options = {
    where: 'Genus like \'%Quercus%\'',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-118.163, 34.162],
          [-118.108, 34.162],
          [-118.108, 34.173],
          [-118.163, 34.173],
          [-118.163, 34.162],
        ],
      ],
    },
    limit: 4,
    offset: 1,
  };
  const features = require(`./fixtures/${data}.json`).features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, 4);
  t.equal(filtered[0].properties.Common_Name, 'LIVE OAK');
  t.equal(filtered[0].properties.Trunk_Diameter, 1);
  t.equal(filtered[3].properties.Common_Name, 'LIVE OAK');
  t.equal(filtered[3].properties.Trunk_Diameter, 18);
});

test('With an envelope, an inSR and an outSR', (t) => {
  const options = {
    f: 'json',
    returnGeometry: true,
    spatialRel: 'esriSpatialRelIntersects',
    geometry: {
      xmin: -13151597,
      ymin: 4050894,
      xmax: -13150342,
      ymax: 4051582,
      spatialReference: {
        wkid: 102100,
        latestWkid: 3857,
      },
    },
    geometryType: 'esriGeometryEnvelope',
    inSR: 102100,
    outFields: '*',
    outSR: 102100,
  };
  run('trees', options, 6, t);
});

test('With a multi-ring geometry and an inSR', (t) => {
  const options = {
    geometry: {
      rings: [
        [
          [19930537.269606635, -1018885.7633881811],
          [19930537.269606635, 13148258.807095852],
          [20037508.342788905, 13148258.807095852],
          [20037508.342788905, -1018885.7633881811],
          [19930537.269606635, -1018885.7633881811],
        ],
        [
          [-20037508.342788905, -1018885.7633881811],
          [-20037508.342788905, 13148258.807095852],
          [-4568447.54013514, 13148258.807095852],
          [-4568447.54013514, -1018885.7633881811],
          [-20037508.342788905, -1018885.7633881811],
        ],
      ],
    },
    geometryType: 'esriGeometryPolygon',
    inSR: 102100,
  };
  run('ringbug', options, 30, t);
});

test('with a coded value domain', (t) => {
  const options = {
    where: 'State = \'1\'',
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
              code: '1',
            },
            {
              name: 'Maryland',
              code: '2',
            },
          ],
        },
        defaultValue: null,
      },
    ],
  };
  run('cvd', options, 2, t);
});

test('with a numeric coded value domain', (t) => {
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
              code: 1,
            },
            {
              name: 'Maryland',
              code: 2,
            },
          ],
        },
        defaultValue: null,
      },
    ],
  };
  run('cvd', options, 2, t);
});

test('with a coded value domain', (t) => {
  const options = {
    where: 'ZONING_S = \'INST\'',
    esriFields: require('./fixtures/esriFields.json'),
  };

  t.plan(1);
  const fixtures = _.cloneDeep(require('./fixtures/cvd2.json'));
  const features = fixtures.features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, 1);
});

test('with a date query', (t) => {
  const options = {
    where: 'survey_date >= date 2017-02-05',
  };
  run('trees', options, 4, t);
});

test('with an esri-style date query', (t) => {
  const options = {
    where:
      'survey_date >= \'2017-02-05T00:00:00.000Z\' AND survey_date <= \'2017-03-06T23:59:59.000Z\'',
  };
  run('trees', options, 4, t);
});

test('with a timestamp query', (t) => {
  const options = {
    where: 'survey_date >= timestamp \'2017-02-05\'',
  };
  run('trees', options, 4, t);
});

test('with a between query', (t) => {
  const options = {
    where:
      'survey_date between timestamp \'2017-01-06T00:00:00.000Z\' AND timestamp \'2017-02-06T23:59:59.000Z\'',
  };
  run('trees', options, 2, t);
});

test('with escaped single quote in query', (t) => {
  const options = {
    where: 'Street_Name = \'GRAND\'\'S STREET\'\'S\'',
  };
  run('trees', options, 1, t);
});

test('with a OBJECTID query on data that requires dynamic OBJECTID generation', (t) => {
  t.plan(1);
  const options = {
    toEsri: true,
    limit: 1
  };
  const fixtures = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          OBJECTID: 11303,
          Common_Name: 'SOUTHERN MAGNOLIA',
          survey_date: '2017-01-05T00:00:00.000Z',
        },
        geometry: {
          type: 'Point',
          coordinates: [-118.16230746759626, 34.137113646321595],
        },
      },
    ],
  };
  const queryResult = winnow.query(fixtures, options);
  const objectId = queryResult.features[0].attributes.OBJECTID;
  const filteredResult = winnow.query(fixtures, {
    toEsri: true,
    where: `OBJECTID = ${objectId}`
  });
  t.equal(filteredResult.features.length, 1);
});

test('with null dates in data source', (t) => {
  // Ensure null dates are returned as null, not as 0
  // Bug only occurs when:
  // * 'toEsri' option enabled
  // * the geojson is passed to winnow.query with the metadata.fields populated
  const options = {
    where:
      'Date1 >= timestamp \'2020-01-05 00:00:00\' AND Date1 <= timestamp \'2020-02-08 23:59:59\'',
    toEsri: true,
  };
  t.plan(4);
  const fixtures = _.cloneDeep(require('./fixtures/dates.json'));
  const filtered = winnow.query(fixtures, options);

  t.equal(filtered.features.length, 1);
  const feature = filtered.features[0];
  t.equal(feature.attributes.Date4, null);
  t.equal(feature.attributes.Date5, null);
  t.equal(feature.attributes.Date6, null);
});

function run(data, options, expected, t) {
  t.plan(1);
  const fixtures = _.cloneDeep(require(`./fixtures/${data}.json`));
  const features = fixtures.features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, expected);
}
