const should = require('should') // eslint-disable-line
const defaultVersion = require('../../../lib/defaults/version')

describe('server metadata defaults', () => {
  it('defaults should have expected values', () => {
    defaultVersion.should.deepEqual({
      currentVersion: 10.51,
      fullVersion: '10.5.1'
    })
  })
})
