const should = require('should') // eslint-disable-line
const { error } = require('../src')

describe('Error operations', () => {
  describe('authentication error', () => {
    it('should return a status code 200 and error payload', () => {
      let statusCode
      let responsePayload
      const res = {
        status: function (code) {
          statusCode = code
          return res
        },
        json: function (payload) {
          responsePayload = payload
        }
      }
      error.authentication(res)
      statusCode.should.equal(200)
      responsePayload.should.be.instanceOf(Object)
      responsePayload.should.have.property('error').instanceOf(Object)
      responsePayload.error.should.have.property('code', 400)
      responsePayload.error.should.have.property('message', 'Unable to generate token.')
      responsePayload.error.details.should.be.instanceOf(Array)
      responsePayload.error.details[0].should.equal('Invalid username or password.')
    })
  })

  describe('authorization error', () => {
    it('should return a status code 200 and error payload', () => {
      let statusCode
      let responsePayload
      const res = {
        status: function (code) {
          statusCode = code
          return res
        },
        json: function (payload) {
          responsePayload = payload
        }
      }
      error.authorization(res)
      statusCode.should.equal(200)
      responsePayload.should.be.instanceOf(Object)
      responsePayload.should.have.property('error').instanceOf(Object)
      responsePayload.error.should.have.property('code', 499)
      responsePayload.error.should.have.property('message', 'Token Required')
      responsePayload.error.details.should.be.instanceOf(Array)
    })
  })
})
