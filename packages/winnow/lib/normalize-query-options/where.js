function normalizeWhere (where) {
  if (isEsriSelectAll(where)) return undefined
  if (containsSqlDates(where)) return convertToISODates(where)
  return where
}

function convertToISODates (where) {
  const matches = where.match(/(?!date )('?\d\d\d\d-\d\d-\d\d'?)/g)
  matches.forEach(match => {
    where = where.replace(`date ${match}`, `'${new Date(match.toString()).toISOString()}'`)
  })
  return where
}

function isEsriSelectAll (where) {
  return /1\s*=\s*1/.test(where)
}

function containsSqlDates (where) {
  return /(?!date )('?\d\d\d\d-\d\d-\d\d'?)/.test(where)
}

module.exports = normalizeWhere
