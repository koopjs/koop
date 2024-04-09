const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const sendPrettyJsonSpy = sinon.spy(() => {
  return { pretty: 'json' };
});

const sendCallbackResponseSpy = sinon.spy(() => {
  return 'callback-string';
});

const sendPbfSpy = sinon.spy(() => {
  return 'pbf';
});
const responseHandler = proxyquire('./query-response-handler', {
  './helpers': {
    sendPrettyJson: sendPrettyJsonSpy,
    sendCallbackResponse: sendCallbackResponseSpy,
    sendPbf: sendPbfSpy,
  },
});

describe('query response handler', () => {
  const res = {
    json: () => {
      return res;
    },
    send: () => {
      return res;
    },
    set: () => {
      return res;
    },
    status: () => {
      return res;
    },
  };

  beforeEach(() => {
    sinon.spy(res);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('return 200 and json', () => {
    responseHandler(res, { test: true }, {});
    res.send.notCalled.should.equal(true);
    res.status.firstCall.args[0].should.be.exactly(200);
    res.json.firstCall.args[0].should.deepEqual({ test: true });
  });

  it('send as callback-string', () => {
    responseHandler(
      res,
      { test: true },
      {
        callback: 'test-callback',
      },
    );

    sendCallbackResponseSpy.firstCall.args.should.deepEqual([
      res,
      { test: true },
      'test-callback',
    ]);
  });

  it('send as pretty json', () => {
    responseHandler(
      res,
      { test: true },
      {
        f: 'pjson',
      },
    );

    sendPrettyJsonSpy.firstCall.args.should.deepEqual([res, { test: true }]);
  });

  it('send as pbf', () => {
    responseHandler(
      res,
      { test: true },
      {
        f: 'pbf',
      },
    );

    sendPbfSpy.firstCall.args.should.deepEqual([
      res,
      { test: true },
      {
        f: 'pbf',
      },
    ]);
  });
});
