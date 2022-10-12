const test = require('tape');
const calculateStdDevIntervals = require('./calculate-std-dev-intervals');

test('calculateStdDevIntervals: invalid std dev interval', (spec) => {
  const result = calculateStdDevIntervals([5, 6, 7, 6, 9, 2, 12, 15, 8, 40], {
    stddev_intv: 0.33,
  });
  spec.deepEquals(result, [5.866775, 16.133225]);
  spec.end();
});
