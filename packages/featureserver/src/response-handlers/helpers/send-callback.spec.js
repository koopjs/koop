const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const { sendCallbackResponse } = require('./');

const res = {
  set: sinon.spy(() => {
    return res;
  }),
  status: sinon.spy(() => {
    return res;
  }),
  send: sinon.spy(),
};

describe('sendCallbackResponse', () => {
  it('should respond with callback string', () => {
    sendCallbackResponse(res, { hello: 'world' }, 'what');
    res.set.firstCall.args.should.deepEqual(['Content-Type', 'application/javascript']);
    res.send.firstCall.args[0].should.equal('what({"hello":"world"})');
    res.status.firstCall.args[0].should.be.exactly(200);
  });
});
