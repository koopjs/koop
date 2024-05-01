require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('query handler', () => {
  const handlerSpy = sinon.spy();
  const querySpy = sinon.spy(() => {
    return { foo: 'bar' };
  });
  const query = proxyquire('./index', {
    '../response-handlers': {
      queryResponseHandler: handlerSpy,
    },
    './query-json': { queryJson: querySpy },
  });

  afterEach(() => {
    handlerSpy.resetHistory();
    querySpy.resetHistory();
  });

  it('should pass query result to query handler', () => {
    const req = {
      app: {
        locals: {},
      },
      query: {},
      body: {},
    };

    query(req, {});
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        foo: 'bar',
      },
      { resultRecordCount: 2000 },
    ]);
  });
});
