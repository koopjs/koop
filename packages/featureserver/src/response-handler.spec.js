const should = require('should') // eslint-disable-line
const sinon = require('sinon');
const responseHandler = require('./response-handler');

describe('request handler', () => {
  const res = {
    json: () => { return res; },
    send: () => { return res; },
    set: () => { return res; },
    status: () => { return res; }
  };

  const req = {
    query: {}
  };

  beforeEach(() => {
    sinon.spy(res);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('return 200 and json', () => {
    responseHandler(req, res, 200, { test: true });
    res.send.notCalled.should.equal(true);
    res.status.firstCall.args[0].should.be.exactly(200);
    res.json.firstCall.args[0].should.deepEqual({ test: true });
  });

  it('return 500 and json', () => {
    responseHandler(req, res, 500, { test: true });
    res.send.notCalled.should.equal(true);
    res.status.firstCall.args[0].should.be.exactly(500);
    res.json.firstCall.args[0].should.deepEqual({ test: true });
  });

  it('return 200 and callback', () => {
    const reqCallback = {
      query: {
        callback: 'test'
      }
    };
    responseHandler(reqCallback, res, 200, { test: true });
    res.send.firstCall.args[0].should.equal('test({"test":true})');
    res.status.firstCall.args[0].should.be.exactly(200);
    res.json.notCalled.should.equal(true);
  });

  it('return 200 and pjson', () => {
    const reqPretty = {
      query: {
        f: 'pjson'
      }
    };
    responseHandler(reqPretty, res, 200, { test: true });
    res.send.firstCall.args[0].should.equal(`{
  "test": true
}`);
    res.status.firstCall.args[0].should.be.exactly(200);
    res.json.notCalled.should.equal(true);
  });
});
