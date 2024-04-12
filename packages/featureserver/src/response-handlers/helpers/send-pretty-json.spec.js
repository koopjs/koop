const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const { sendPrettyJson } = require('.');

const res = {
  set: sinon.spy(() => {
    return res;
  }),
  status: sinon.spy(() => {
    return res;
  }),
  send: sinon.spy(),
};

describe('sendPrettyJson', () => {
  it('should respond with callback string', () => {
    sendPrettyJson(res, { hello: 'world' });
    res.set.firstCall.args.should.deepEqual(['Content-Type', 'application/json; charset=utf-8']);
    res.send.firstCall.args[0].should.deepEqual(JSON.stringify({ hello: 'world' }, null, 2));
    res.status.firstCall.args[0].should.be.exactly(200);
  });
});
