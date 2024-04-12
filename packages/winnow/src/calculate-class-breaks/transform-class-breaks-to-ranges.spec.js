const test = require('tape');
const transformClassBreaksToRanges = require('./transform-class-breaks-to-ranges');

test('transformClassBreaksToRanges: non-stddev', (spec) => {
  const result = transformClassBreaksToRanges([-3.01, -1.02, 2.01, 6.003, 9.004]);
  spec.deepEquals(result, [
    [-3.01, -1.02],
    [-1.01, 2.01],
    [2.02, 6.003],
    [6.004, 9.004],
  ]);
  spec.end();
});

test('transformClassBreaksToRanges: stddev', (spec) => {
  const result = transformClassBreaksToRanges([-3.01, -1.02, 2.01, 6.003, 9.004], {
    method: 'stddev',
  });
  spec.deepEquals(result, [
    [-3.01, -1.03],
    [-1.02, 2],
    [2.01, 6.003],
    [6.004, 9.004],
  ]);
  spec.end();
});
