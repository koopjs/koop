const should = require('should') // eslint-disable-line
const { error } = require('../..')

describe('Error operations', () => {
  describe('authentication error', () => {
    it('without callback param, should return a status code 200 and error payload', () => {
      let statusCode
      let responsePayload
      const req = { query: {} }
      const res = {
        status: function (code) {
          statusCode = code
          return res
        },
        json: function (payload) {
          responsePayload = payload
        }
      }
      error.authentication(req, res)
      statusCode.should.equal(200)
      responsePayload.should.be.instanceOf(Object)
      responsePayload.should.have.property('error').instanceOf(Object)
      responsePayload.error.should.have.property('code', 400)
      responsePayload.error.should.have.property('message', 'Unable to generate token.')
      responsePayload.error.details.should.be.instanceOf(Array)
      responsePayload.error.details[0].should.equal('Invalid username or password.')
    })

    it('should return a status code 200 and error payload', () => {
      const req = { query: { callback: 'test' } }
      const res = {
        set: function (header, value) {
          header.should.equal('Content-Type')
          value.should.equal('application/javascript')
        },
        send: function (response) {
          response.should.equal('test({"error":{"code":400,"message":"Unable to generate token.","details":["Invalid username or password."]}})')
        }
      }
      error.authentication(req, res)
    })
  })

  describe('authorization error', () => {
    it('should return a status code 200 and error payload', () => {
      let statusCode
      let responsePayload
      const req = { query: {} }
      const res = {
        status: function (code) {
          statusCode = code
          return res
        },
        json: function (payload) {
          responsePayload = payload
        }
      }
      error.authorization(req, res)
      statusCode.should.equal(200)
      responsePayload.should.be.instanceOf(Object)
      responsePayload.should.have.property('error').instanceOf(Object)
      responsePayload.error.should.have.property('code', 499)
      responsePayload.error.should.have.property('message', 'Token Required')
      responsePayload.error.details.should.be.instanceOf(Array)
    })

    it('with callback param, should return a status code 200 and error payload', () => {
      const req = { query: { callback: 'test' } }
      const res = {
        set: function (header, value) {
          header.should.equal('Content-Type')
          value.should.equal('application/javascript')
        },
        send: function (response) {
          response.should.equal('test({"error":{"code":499,"message":"Token Required","details":[]}})')
        }
      }
      error.authorization(req, res)
    })
  })
})
