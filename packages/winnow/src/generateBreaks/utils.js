'use strict'
const ss = require('simple-statistics')

function adjustIntervalValue (value, index, array, isStddev) {
  // TODO: determine how to fix rounding on large decimal places (e.g., [1 - 2.33334], [2.3333*6* - 3])

  // if stddev classification method, create intervals by decreasing max value
  if (isStddev) {
    // lower
    if (index === array.length / 2 - 1) return [value, array[index + 1]]
    else if (index === array.length / 2) return null
    else if (index < array.length / 2 - 1) {
      let maxValue = array[index + 1] || array[0]
      if (isNaN(maxValue)) throw new Error('Previous break value is non-numeric: ' + maxValue)
      if (maxValue !== 0 && maxValue !== array[0]) {
        const divisor = Math.pow(10, getPrecision(maxValue))
        maxValue = Math.round((maxValue - (1 / divisor)) * divisor) / divisor
      }
      return [value, maxValue]
    }
    // otherwise, continue create intervals above mean interval
  }

  // create intervals by increasing min value
  let minValue = array[index - 1] || array[0]
  if (isNaN(minValue)) throw new Error('Previous break value is non-numeric: ' + minValue)
  if (minValue !== 0 && minValue !== array[0]) {
    const divisor = Math.pow(10, getPrecision(minValue))
    minValue = Math.round((minValue + (1 / divisor)) * divisor) / divisor
  }
  return [minValue, value]
}

function getPrecision (a) {
  if (!isFinite(a)) return 0
  let e = 1
  let p = 0
  while (Math.round(a * e) / e !== a) { e *= 10; p++ }
  return p
}

function calculateStdDevIntervals (values, classification) {
  if (!classification.stddev_intv) throw new Error('must supply a standard deviation interval')
  const intv = classification.stddev_intv
  if (intv !== 0.25 && intv !== 0.33 && intv !== 0.5 && intv !== 1) throw new Error('Unacceptable interval value: ' + intv)

  const mean = ss.mean(values)
  const stddev = ss.standardDeviation(values)
  const breakCount = classification.breakCount
  let intervals = []

  // create interval around mean
  const minMeanInt = Number((mean - (0.5 * stddev)).toFixed(6))
  const maxMeanInt = Number((mean + (0.5 * stddev)).toFixed(6))
  intervals.unshift(minMeanInt)
  intervals.push(maxMeanInt)

  // create positive & negative stddev intervals
  let maxPosStd, minNegStd
  for (let i = 1; i <= breakCount; i++) {
    minNegStd = Number((minMeanInt - (i * stddev)).toFixed(6))
    maxPosStd = Number((maxMeanInt + (i * stddev)).toFixed(6))
    intervals.unshift(minNegStd)
    intervals.push(maxPosStd)
  }
  return intervals
}

module.exports = { adjustIntervalValue, calculateStdDevIntervals }
