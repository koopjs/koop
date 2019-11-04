function createClause (options) {
  const groupBy = options.groupBy
  if (groupBy) {
    const selector = options.esri ? 'attributes' : 'properties'
    const groups = groupBy.reduce((fragment, group) => {
      return `${fragment} ${selector}->\`${group}\`,`
    }, '').slice(0, -1)
    return ` GROUP BY ${groups}`
  } else {
    return ''
  }
}

module.exports = { createClause }
