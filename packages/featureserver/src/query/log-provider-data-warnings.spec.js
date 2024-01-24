const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('logWarnings', () => {
  const loggerSpy = sinon.spy(() => {});

  const { logWarnings } = proxyquire('./log-warnings', {
    '../log-manager': {
      logger: {
        debug: loggerSpy,
      },
    },
  });

  afterEach(() => {
    loggerSpy.resetHistory();
  });

  it('should log missing idField', () => {
    logWarnings({}, {});
    loggerSpy.callCount.should.equal(1);
    loggerSpy.firstCall.args.should.deepEqual([
      `provider data has no OBJECTID and has no "idField" assignment. You will get the most reliable behavior from ArcGIS clients if the provider assigns the "idField" to a property that is an integer in range 0 - ${Number.MAX_SAFE_INTEGER}. An OBJECTID field will be auto-generated in the absence of an "idField" assignment.`,
    ]);
  });

  it('should log mixed-case OBJECTID', () => {
    logWarnings({ metadata: { idField: 'objEctId' } }, {});
    loggerSpy.callCount.should.equal(1);
    loggerSpy.firstCall.args.should.deepEqual([
      'requested provider has "idField" that is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients.',
    ]);
  });

  it('should log field definition not found in feature', () => {
    logWarnings({
      metadata: { fields: [{ name: 'foo', type: 'String' }] },
      features: [{ properties: {} }],
    }, {});
    loggerSpy.callCount.should.equal(2);
    loggerSpy.secondCall.args.should.deepEqual([
      'field definition "foo (String)" not found in first feature of provider\'s GeoJSON',
    ]);
  });

  it('should log field definition - feature property type mismatch', () => {
    logWarnings({
      metadata: { fields: [{ name: 'foo', type: 'String' }] },
      features: [{ properties: { foo: 1000 } }],
    }, 
    {});
    loggerSpy.callCount.should.equal(2);
    loggerSpy.secondCall.args.should.deepEqual([
      'field definition "foo (String)" not found in first feature of provider\'s GeoJSON',
    ]);
  });

  it('should not log warning if field definition matches feature', () => {
    logWarnings({
      metadata: { fields: [{ name: 'foo', type: 'String' }] },
      features: [{ properties: { foo: 'bar' } }],
    }, {});
    loggerSpy.callCount.should.equal(1);
  });

  it('should not log warning if field type mismatch is Esri exception', () => {
    logWarnings({
      metadata: { fields: [{ name: 'foo', type: 'Date' }] },
      features: [{ properties: { foo: 12345 } }],
    }, {});
    loggerSpy.callCount.should.equal(1);
  });

  it('should log feature property not found in field definitions', () => {
    logWarnings({
      metadata: { fields: [] },
      features: [{ properties: { foo: 'bar' } }],
    }, {});
    loggerSpy.callCount.should.equal(2);
    loggerSpy.secondCall.args.should.deepEqual([
      'requested provider has feature with property "foo" that was not defined in metadata fields array',
    ]);
  });
});
