const test = require('tape');
const { filterAndTransform } = require('./');

// Within - the search geometry MUST BE WITHIN the FEATURE GEOM

test('sql.fn.ST_Within - search geometry fully within feature geometry', (t) => {
  t.equals(typeof filterAndTransform.fn.ST_Within, 'function');
  t.equals(typeof filterAndTransform.fn.ST_Contains, 'function');
  t.equals(typeof filterAndTransform.fn.ST_Intersects, 'function');
  t.equals(typeof filterAndTransform.fn.ST_EnvelopeIntersects, 'function');
  t.end();
});
