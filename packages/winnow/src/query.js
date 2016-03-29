'use strict'
const Terraformer = require('terraformer')
const operators = ['>', '<', '=', '>=', '<=', 'like', 'ilike', 'in']

function create (options) {
  let query = selectClause(options)
  const where = whereClause(options)
  const geomFilter = geometryClause(options)
  if (options.where || options.geometry) query += ' WHERE '
  if (options.where) query += where
  if (options.geometry && !where) query += geomFilter
  if (options.geometry && where) query += ` AND ${geomFilter}`
  if (options.limit) query += ` LIMIT ${options.limit}`
  if (options.offset) query += ` OFFSET ${options.offset}`
  return query
}

function selectClause (options) {
  if (options.aggregates) return aggSelect(options.aggregates)
  else if (options.fields) return fieldSelect(options.fields)
  else return 'SELECT * FROM ?'
}

function aggSelect (aggregates) {
  const select = aggregates.reduce((sql, agg) => {
    const name = agg.name || `${agg.type}_${agg.field}`
    let func
    if (agg.options) {
      func = `${agg.type}(properties->${agg.field}, ${agg.options})`
    } else {
      func = `${agg.type}(properties->${agg.field})`
    }
    return `${sql} ${func} as ${name},`
  }, 'SELECT')
  return `${select.slice(0, -1)} FROM ?`
}

function fieldSelect (fields, options) {
  options = options || {}
  if (typeof fields !== 'string') fields = fields.join(',')
  else fields = fields.replace(/,\s+/g, ',')
  const type = options.esri ? 'attributes' : 'properties'
  return `SELECT type, pick(properties, "${fields}") as ${type}, geometry FROM ?`
}

function geometryClause (options) {
  if (!options.geometry) return
  const spatialPredicate = options.spatialPredicate || 'ST_Within'
  return `${spatialPredicate}(geometry, ?)`
}

function params (features, geometry) {
  const params = Array.isArray(features) ? [features] : [[features]]
  if (geometry) params.push(geometry)
  return params
}

function setGeometry (geom) {
  if (!geom) return
  const geometry = (geom.xmin && geom.ymax) ? transformEnvelope(geom) : geom
  return geometry
}

function transformEnvelope (geom) {
  const polygon = new Terraformer.Polygon({
    type: 'Polygon',
    coordinates: [[
      [geom.xmin, geom.ymin],
      [geom.xmin, geom.ymax],
      [geom.xmax, geom.ymax],
      [geom.xmax, geom.ymin],
      [geom.xmin, geom.ymin]
    ]]
  })
  const isMercator = geom.spatialReference && (geom.spatialReference.wkid === 102100 || geom.spatialReference.latestWkid === 3857)
  if (isMercator) {
    return Terraformer.toGeographic(polygon)
  } else if (geom.spatialReference && geom.spatialReference.wkid) {
    throw new Error(`Spatial Reference: ${geom.spatialReference.wkid} not supported`)
  } else {
    return polygon
  }
}

/**
 * Creates a viable SQL where clause from a passed in SQL (from a url "where" param)
 *
 * @param {string} where - a sql where clause
 * @param {Array} fields - a list of fields in to support coded value domains
 * @return {string} sql
 */
function whereClause (options) {
  options = options || {}
  if (!options.where) return ''
  let tokens = tokenize(options.where)
  if (options.fields) {
    tokens = decodeDomains(tokens, options.fields)
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
  const regex = /'\S+\s\S+'/g
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
  return operators.indexOf(middle) > -1
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
  const temp = value.replace(/^\(+|\)+$/, '')
  fields.forEach(function (field) {
    if (field.domain && (field.domain.name && field.domain.name === fieldName)) {
      field.domain.codedValues.forEach(function (coded) {
        if (parseInt(coded.code, 10) === parseInt(temp, 10)) {
          value = value.replace(temp, coded.name)
        }
      })
    }
  })
  return value
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
 * Apply postgres JSON selects where appropriate
 */
function jsonify (token, next, options) {
  options = options || {}
  let leading = ''
  const lastPar = token.lastIndexOf('(')
  if (lastPar > -1) {
    leading = token.slice(0, lastPar + 1)
    token = token.replace(/\(/g, '')
  }
  const selector = options.esri ? 'attributes' : 'properties'
  if (next) next = next.toLowerCase()
  if (operators.indexOf(next) > -1) return `${leading} ${selector}->${token.replace(/'|"/g, '')}`
  else return leading + token
}

function isNumeric (num) {
  return (num >= 0 || num < 0)
}

module.exports = {create, params, setGeometry}
