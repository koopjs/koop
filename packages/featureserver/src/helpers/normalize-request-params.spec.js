const should = require('should'); // eslint-disable-line
require('should-sinon');
const { normalizeRequestParameters } = require('./normalize-request-params');

describe('normailizeRequestParameters', () => {
  it('should use resultRecordCount when available', () => {
    const result = normalizeRequestParameters({ resultRecordCount: 99 }, {});
    result.should.deepEqual({ resultRecordCount: 99 });
  });

  it('should remove empty strings from query params', () => {
    const result = normalizeRequestParameters({ test: '', foo: 'barb', boo: 400 }, {});
    result.should.deepEqual({ foo: 'barb', boo: 400, resultRecordCount: 2000 });
  });

  it('should coerce query string boolean', () => {
    const result = normalizeRequestParameters({ test: 'true', foo: 'false' }, {});
    result.should.deepEqual({
      test: true,
      foo: false,
      resultRecordCount: 2000,
    });
  });

  it('should parse json', () => {
    const result = normalizeRequestParameters({ test: JSON.stringify({ foo: 'bard' }) }, {});
    result.should.deepEqual({
      test: { foo: 'bard' },
      resultRecordCount: 2000,
    });
  });

  it('should merge body and query', () => {
    const result = normalizeRequestParameters({ resultRecordCount: '99' }, { foo: 'bart' });
    result.should.deepEqual({ resultRecordCount: 99, foo: 'bart' });
  });

  it('should coerce body string parameters', () => {
    const result = normalizeRequestParameters(
      {},
      {
        boolTrue: 'true',
        boolFalse: 'false',
        numberInt: '1',
        numberDecimal: '1.1',
        emptyParam: '',
      },
    );
    result.should.deepEqual({
      boolTrue: true,
      boolFalse: false,
      numberInt: 1,
      numberDecimal: 1.1,
      resultRecordCount: 2000,
    });
  });
});
