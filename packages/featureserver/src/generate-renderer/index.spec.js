require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe(' handler', () => {
  const handlerSpy = sinon.spy();
  const buildRendererSpy = sinon.spy(() => {
    return { foo: 'bar' };
  });
  const generateRendererHandler = proxyquire('./index', {
    '../response-handlers': {
      generalResponseHandler: handlerSpy,
    },
    './build-renderer': { buildRenderer: buildRendererSpy },
  });

  afterEach(() => {
    handlerSpy.resetHistory();
    buildRendererSpy.resetHistory();
  });

  it('should pass query result to generateRenderer handler', () => {
    const req = {
      app: {
        locals: {},
      },
      query: {},
      body: {},
    };

    generateRendererHandler(req, {});
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        foo: 'bar',
      },
      {},
    ]);
  });
});
