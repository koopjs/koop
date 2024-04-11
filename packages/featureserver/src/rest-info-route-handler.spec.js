const should = require('should'); // eslint-disable-line
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const CURRENT_VERSION = 11.2;
const FULL_VERSION = '11.2.0';

describe('rest/info handler', () => {
  const handlerSpy = sinon.spy();
  const restInfo = proxyquire('./rest-info-route-handler', {
    './response-handlers': {
      generalResponseHandler: handlerSpy,
    },
  });

  afterEach(() => {
    handlerSpy.resetHistory();
  });

  it('should return default info', () => {
    const req = {
      app: {
        locals: {},
      },
      query: {},
      body: {},
    };

    restInfo(req, {});
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        currentVersion: CURRENT_VERSION,
        fullVersion: FULL_VERSION,
        authInfo: {},
        owningSystemUrl: undefined,
      },
      {},
    ]);
  });

  it('should throw error on invalid format', () => {
    const req = {
      app: {
        locals: {},
      },
      query: { f: 'baz' },
      body: {},
    };

    try {
      restInfo(req, {});
    } catch (error) {
      error.message.should.equal('Invalid format');
      error.code.should.equal(400);
    }
  });

  it('should return default plus supplied info', () => {
    const data = {
      authInfo: { foo: 'bar' },
      owningSystemUrl: 'helloworld',
    };
    const req = {
      app: {
        locals: {},
      },
    };
    restInfo(req, {}, data);
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        currentVersion: CURRENT_VERSION,
        fullVersion: FULL_VERSION,
        authInfo: { foo: 'bar' },
        owningSystemUrl: 'helloworld',
      },
      {},
    ]);
  });

  it('should return versions from app.locals', () => {
    const req = {
      app: {
        locals: {
          config: {
            featureServer: {
              currentVersion: 10.81,
              fullVersion: '10.8.1',
            },
          },
        },
      },
    };

    restInfo(
      req,
      {},
      { authInfo: { foo: 'bar' }, owningSystemUrl: 'helloworld' },
    );
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        currentVersion: 10.81,
        fullVersion: '10.8.1',
        authInfo: { foo: 'bar' },
        owningSystemUrl: 'helloworld',
      },
      {},
    ]);
  });
});
