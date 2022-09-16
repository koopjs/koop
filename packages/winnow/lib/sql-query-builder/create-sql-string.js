const createWhereClause = require('./where')
const createSelectSql = require('./select')
const createOrderByClause = require('./order-by')
const createGroupByClause = require('./group-by')

function create (options = {}) {
  const select = createSelectSql(options)
  const where = createWhereClause(options)
  const orderBy = createOrderByClause(options)
  const groupBy = createGroupByClause(options)
  const limit = options.limit ? ` LIMIT ${options.limit}` : ''
  const offset = options.offset ? ` OFFSET ${options.offset}` : ''
  return `${select}${where}${groupBy}${orderBy}${limit}${offset}`
}

module.exports = create
