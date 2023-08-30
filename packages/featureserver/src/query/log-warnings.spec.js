const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('logWarnings', () => {
  const loggerSpy = sinon.spy(() => {});

  const { logWarnings } = proxyquire('./log-warnings', {
    '../logger': {
      logger: {
        debug: loggerSpy,
      },
    },
  });
  
  afterEach(() => {
    loggerSpy.resetHistory();
  });

  it('should log missing idField', () => {
    logWarnings({});
    loggerSpy.callCount.should.equal(1);
    loggerSpy.firstCall.args.should.deepEqual([
      'requested provider has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an unchanging 32-bit integer. An OBJECTID field will be auto-generated in the absence of an "idField" assignment.',
    ]);
  });

  
});
