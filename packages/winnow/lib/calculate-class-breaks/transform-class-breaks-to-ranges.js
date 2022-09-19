const _ = require('lodash');

function transformClassBreaksToRanges(classBreakArray, { method } = {}) {
  const arrayLength = classBreakArray.length;
  return _.range(0, arrayLength - 1)
    .map((index) => {
      return [classBreakArray[index], classBreakArray[index + 1]];
    })
    .map((range, index) => {
      if (method === 'stddev' && index < arrayLength) {
        return stddevRangeAdjustments({ range, index, arrayLength });
      }
      if (index === 0) return range;

      return rangeAdjustments(range);
    });
}

function stddevRangeAdjustments({ range, index, arrayLength }) {
  const divisor = Math.pow(10, getPrecision(range[0]));
  const midpointIndex = Math.ceil(arrayLength / 2);
  if (index === midpointIndex - 1) {
    return range;
  }
  if (index <= midpointIndex - 1) {
    const max = Math.round((range[1] - 1 / divisor) * divisor) / divisor;
    return [range[0], max];
  }

  const min = Math.round((range[0] + 1 / divisor) * divisor) / divisor;
  return [min, range[1]];
}

function rangeAdjustments(range) {
  const divisor = Math.pow(10, getPrecision(range[0]));
  const min = Math.round((range[0] + 1 / divisor) * divisor) / divisor;
  return [min, range[1]];
}

function getPrecision(value) {
  if (!isFinite(value)) return 0;
  let e = 1;
  let precision = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    precision++;
  }
  return precision;
}

module.exports = transformClassBreaksToRanges;
