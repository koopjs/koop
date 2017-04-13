const OPERATORS = ['>', '<', '=', '>=', '<=', 'like', 'ilike', 'in']

/**
 * Creates a viable SQL where clause from a passed in SQL (from a url "where" param)
 *
 * @param {string} where - a sql where clause
 * @param {Array} fields - a list of fields in to support coded value domains
 * @return {string} sql
 */
function createClause (options) {
  options = options || {}
  if (!options.where) return ''
  let tokens = tokenize(options.where)
  if (options.esriFields) {
    tokens = decodeDomains(tokens, options.esriFields)
  }
  return translate(tokens, options)
}

/**
 * Take arbitrary sql and turns it into a consistent set of tokens
 */
function tokenize (sql) {
  // normalize all the binary expressions
  sql = pad(sql)
  let temp
  // find any multi-word tokens and replace the spaces with a special character
  const regex = /['"]\S+\s\S+['"]/g
  while ((temp = regex.exec(sql)) !== null) {
    const field = temp[0].replace(/\s/, '|@')
    sql = sql.replace(temp[0], field)
  }
  return sql.split(' ')
}

/**
 * Normalize binary operations to consistent spacing
 */
function pad (sql) {
  const operators = [
    {regex: />=/, string: '>='},
    {regex: /<=/, string: '<='},
    {regex: /=/, string: '='},
    {regex: />(?!=)/, string: '>'},
    {regex: /<(?!=)/, string: '<'}
  ]
  const padded = operators.reduce(function (statement, op) {
    const pad = statement.replace(op.regex, ` ${op.string} `)
    // ugly hack because javascripts haz no lookbehind
    return pad.replace(/> =/, '>=').replace(/< =/, '<=').replace(/i like/, 'ilike')
  }, sql)
  return padded.replace(/\s\s/g, ' ')
}

/**
 * Iterate through all tokens and replace values that belong to a coded domain
 * @param {array} tokens - a set of tokens for a sql where clause
 * @param {array} fields - the set of fields from a geoservices compatible service
 * @return {array} a set of tokens where any coded values have been decoded
 */
function decodeDomains (tokens, fields) {
  return tokens.map(function (token, i) {
    if (i < 2) return token
    const left = tokens[i - 2]
    const middle = tokens[i - 1]
    const right = token
    // if this set of 3 tokens makes a binary operation then check if we need to apply a domain
    if (isBinaryOp(left, middle, right)) return applyDomain(left, right, fields)
    else return token
  })
}

/**
 * Check whether 3 tokens make up a binary operation
 */
function isBinaryOp (left, middle, right) {
  if (!left || !middle || !right) return false
  return OPERATORS.indexOf(middle) > -1
}

/**
 * Check for any coded values in the fields
 * if we find a match, replace value with the coded val
 *
 * @param {string} fieldName - the name of field to look for
 * @param {number} value - the coded value
 * @param {Array} fields - a list of fields to use for coded value replacements
 */
function applyDomain (fieldName, value, fields) {
  const domain = fields.filter(f => { return f.name === fieldName })[0].domain
  if (domain && domain.codedValues) {
    const decoded = domain.codedValues.filter(cv => { return value.match(cv.code) })[0].name
    return typeof decoded === 'string' ? `'${decoded}'` : decoded
  } else {
    return value
  }
}

/**
 * Translate tokens to be compatible with postgres json
 */
function translate (tokens, options) {
  const parts = tokens.map(function (token, i) {
    const middle = tokens[i + 1]
    if (!middle) return token
    // if this is a field name wrap it in postgres json
    const left = jsonify(token, middle, options)
    const right = removeTrailingParen(tokens[i + 2])
    // if this is a numeric operation cast to float
    return cast(left, middle, right)
  })
  return parts.join(' ').replace(/\|@/g, ' ')
}

/**
 * Cast a JSON selector to float if this is a numeric operation
 */
function cast (left, middle, right) {
  const numericOp = ['>', '<', '=', '>=', '<='].indexOf(middle) > -1 && isNumeric(right)
  if (numericOp) return left
  else return left
}

/**
 * Removes the trailing parameter from a sql token
 */
function removeTrailingParen (token) {
  if (!token) return undefined
  const paren = token.indexOf(')') > -1
  if (paren) return token.slice(0, paren)
  else return token
}

/**
 * Apply JSON selectors where appropriate
 */
function jsonify (token, next, options) {
  options = options || {}
  let leading = ''
  const lastPar = token.lastIndexOf('(')
  if (lastPar > -1) {
    leading = token.slice(0, lastPar + 1)
    token = token.slice(lastPar + 1, token.length)
  }
  const trailingParens = token.match(/\)+\s*$/)
  let trailing = ''
  if (trailingParens) {
    trailing = trailingParens[0]
    token = token.slice(0, trailingParens.index)
  }
  const selector = options.esri ? 'attributes' : 'properties'
  if (next) next = next.toLowerCase()
  if (OPERATORS.indexOf(next) > -1) return `${leading}${selector}->\`${token.replace(/'|"/g, '')}\`${trailing}`
  else return leading + token + trailing
}

function isNumeric (num) {
  return (num >= 0 || num < 0)
}

module.exports = { createClause }
