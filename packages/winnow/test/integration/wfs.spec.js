const test = require('tape');
const winnow = require('../..');

test('WFS with a bbox in Web Mercator with geojson output', (t) => {
  const options = {
    outputFormat: 'application/json',
    bbox: '-118.163,34.162,-118.108,34.173,EPSG:4326',
    srsName: 'EPSG:4326',
  };
  t.plan(1);
  const features = require('./fixtures/trees.json').features;
  const filtered = winnow.query(features, options);
  t.equal(filtered.length, 12);
});
