process.env.KOOP_WARNINGS = 'suppress';

const Benchmark = require('benchmark');
const fs = require('fs-extra');
const path = require('path');
const winnow = require('../index.js');

const features = fs.readJSONSync(path.join(__dirname, './fixtures.geojson')).features;
const suite = new Benchmark.Suite();

suite
  .add('query all', function () {
    winnow.query(features, {
      where: '1=1'
    });
  })
  .add('query with filter', function () {
    winnow.query(features, {
      where: 'OBJECTID = \'east\''
    });
  })
  .add('query with geo filter', function () {
    winnow.query(features, {
      geometry: {
        xmin: 50,
        ymin: 50,
        xmax: 80,
        ymax: 80,
        spatialReference: {
          wkid: '4326'
        }
      },
      spatialPredicate: 'ST_Within'
    });
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run({ async: true });
