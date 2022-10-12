const should = require('should') // eslint-disable-line
const { authenticate } = require('../..');

describe('Authentication handler', () => {
  it('should return a status code 200 and token payload', () => {
    let statusCode;
    let responsePayload;
    const res = {
      status: function (code) {
        statusCode = code;
        return res;
      },
      json: function (payload) {
        responsePayload = payload;
      }
    };
    const mockAuthSuccess = {
      token: 'a-mocked-token-response',
      expires: 100000000
    };
    authenticate(res, mockAuthSuccess);
    statusCode.should.equal(200);
    responsePayload.should.be.instanceOf(Object);
    responsePayload.should.have.property('token', 'a-mocked-token-response');
    responsePayload.should.have.property('expires', 100000000);
    responsePayload.should.have.property('ssl', false);
  });

  it('should return a status code 200 and token payload with ssl property = true', () => {
    let statusCode;
    let responsePayload;
    const res = {
      status: function (code) {
        statusCode = code;
        return res;
      },
      json: function (payload) {
        responsePayload = payload;
      }
    };
    const mockAuthSuccess = {
      token: 'a-mocked-token-response',
      expires: 100000000
    };
    authenticate(res, mockAuthSuccess, true);
    statusCode.should.equal(200);
    responsePayload.should.be.instanceOf(Object);
    responsePayload.should.have.property('token', 'a-mocked-token-response');
    responsePayload.should.have.property('expires', 100000000);
    responsePayload.should.have.property('ssl', true);
  });
});
