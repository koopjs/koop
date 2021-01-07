module.exports = function (stats) {
  const fields = Object.keys(stats[0])
  return fields.reduce((aliases, field) => {
    aliases[field] = field
    return aliases
  }, {})
}
