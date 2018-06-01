function createClause (options = {}) {
  const propType = options.toEsri ? 'attributes' : 'properties'

  if (options.fields) {
    let fields
    if (typeof options.fields !== 'string') fields = options.fields.join(',')
    else fields = options.fields.replace(/,\s+/g, ',')
    if (options.toEsri) { return `pick(properties, "${fields}") as ${propType}` } else { return `type, pick(properties, "${fields}") as ${propType}` }
  } else {
    if (options.toEsri) { return `properties as ${propType}` } else { return `type, properties as ${propType}` }
  }
}

module.exports = { createClause }
