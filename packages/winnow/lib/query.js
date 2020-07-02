const _ = require('lodash')
const Query = require('./sql-query')
const Options = require('./options')
const { breaksQuery, aggregateQuery, standardQuery } = require('./executeQuery')

module.exports = function (input, options = {}) {
  /* First step is detect what kind of input this is.
  i.e. is it a collection object or an array of features?
  If it's a collection object we'll want to return it as such.
  Otherwise we can just return an array */
  let features = input
  if (input.features) {
    options.collection = _.omit(input, 'features')
    features = input.features
  }
  options = Options.prepare(options, features)

  const query = Query.create(options)
  if (process.env.NODE_ENV === 'test') console.log(query, options)

  if (options.classification) return breaksQuery(features, query, options)
  if (options.aggregates) return aggregateQuery(features, query, options)
  else return standardQuery(features, query, options)
}
