const should = require('should'); // eslint-disable-line
const { combineBodyQueryParameters } = require('./combine-body-query-params');

describe('combineBodyQueryParameters', () => {
  it('should merge objects with deference to query', () => {
    combineBodyQueryParameters(
      { foo: 'bar', hello: 'body-param' },
      { foo: 'baz', test: 'query-param' },
    ).should.deepEqual({
      foo: 'baz',
      test: 'query-param',
      hello: 'body-param',
    });
  });

  it('should merge objects with deference to query, strip empty strings', () => {
    combineBodyQueryParameters(
      { foo: 'bar', hello: '' },
      { foo: 'baz', test: 'query-param' },
    ).should.deepEqual({
      foo: 'baz',
      test: 'query-param',
    });
  });
});
