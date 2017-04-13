const test = require('tape')
const prepare = require('../src/options').prepare

test('normalize a where query with an esri-style date', t => {
  t.plan(1)
  const options = {
    where: `foo='bar' AND ISSUE_DATE >= date 2017-01-05 AND ISSUE_DATE <= date 2018-01-05`
  }

  const prepared = prepare(options)

  t.equal(prepared.where, `foo='bar' AND ISSUE_DATE >= '2017-01-05T00:00:00.000Z' AND ISSUE_DATE <= '2018-01-05T00:00:00.000Z'`)
})
