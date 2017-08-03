module.exports = function (value, index, array) {
  // TODO: determine how to fix rounding on large decimal places (e.g., [1 - 2.33334], [2.3333*6* - 3])
  let minValue = array[index - 1] || array[0]
  if (isNaN(minValue)) throw new Error('Previous break value is non-numeric')
  if (minValue !== 0 && minValue !== array[0]) {
    const divisor = Math.pow(10, getPrecision(minValue))
    minValue = Math.round((minValue + (1 / divisor)) * divisor) / divisor
  }
  return minValue
}

function getPrecision (a) {
  if (!isFinite(a)) return 0
  let e = 1
  let p = 0
  while (Math.round(a * e) / e !== a) { e *= 10; p++ }
  return p
}
