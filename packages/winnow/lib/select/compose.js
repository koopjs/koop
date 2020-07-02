module.exports = function (functions, target) {
  return functions.reduce((composed, fx) => {
    if (typeof fx === 'string') {
      return `${fx}(${composed})`
    } else {
      const method = Object.keys(fx)[0]
      return `${method}(${composed},?)`
    }
  }, target)
}
