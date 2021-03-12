const should = require('should') // eslint-disable-line
const restInfo = require('../../lib/rest-info-route-handler')

describe('rest/info handler', () => {
  it('should return default info', () => {
    const result = restInfo()
    result.should.deepEqual({
      currentVersion: 10.51,
      fullVersion: '10.5.1'
    })
  })

  it('should return default plus supplied info', () => {
    const data = {
      hello: {
        world: true
      }
    }
    const result = restInfo(data)
    result.should.deepEqual({
      currentVersion: 10.51,
      fullVersion: '10.5.1',
      hello: {
        world: true
      }
    })
  })
})
