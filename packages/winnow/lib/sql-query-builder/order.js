function createClause (options) {
  const selector = options.esri ? 'attributes' : 'properties'
  const order = options.order
  if (order) {
    const fields = order.reduce((fragment, sort) => {
      const parts = sort.split(' ')
      const field = parts[0]
      let direction
      if (parts[1]) {
        direction = parts[1].toUpperCase()
      } else {
        direction = 'ASC'
      }
      const orderIsAgg = options.aggregates && options.aggregates.some(agg => {
        return field === agg.name
      })
      if (orderIsAgg) return `${fragment} \`${field}\` ${direction},`
      else return `${fragment} ${selector}->\`${field}\` ${direction},`
    }, '').slice(0, -1)
    return ` ORDER BY ${fields}`
  } else {
    return ''
  }
}

module.exports = { createClause }
