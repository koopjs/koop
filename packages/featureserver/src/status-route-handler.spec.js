const should = require('should'); // eslint-disable-line
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('status handler', () => {
  const handlerSpy = sinon.spy();
  const status = proxyquire('./status-route-handler', {
    './response-handlers': {
      generalResponseHandler: handlerSpy,
    },
  });

  afterEach(() => {
    handlerSpy.resetHistory();
  });

  it('should return started state', () => {
    const res = {};
    status({ query: {}, body: {} }, res);
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      res,
      { configuredState: 'STARTED', realTimeState: 'STARTED' },
      {},
    ]);
  });

  it('should pass combined request parameters to response handler', () => {
    status({ query: { f: 'pjson' }, body: { callback: 'cb' } }, {});
    handlerSpy.firstCall.args[2].should.deepEqual({ f: 'pjson', callback: 'cb' });
  });

  it('should throw on invalid format', () => {
    try {
      status({ query: { f: 'html' }, body: {} }, {});
      should.fail('expected error');
    } catch (error) {
      error.message.should.equal('Invalid format');
      error.code.should.equal(400);
    }
    handlerSpy.callCount.should.equal(0);
  });
});
