const winnow = require('../')

module.exports = {
  run (data, options, expected, t) {
    t.plan(1)
    const features = require(`./fixtures/${data}.json`).features
    const filtered = winnow.query(features, options)
    t.equal(filtered.length, expected)
  }
}
