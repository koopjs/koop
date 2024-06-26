require('should');
const { normalizeCapabilities } = require('./normalize-capabilities');

describe('normalizeCapabilities', function () {
  it('combine strings from root-level and metadata object', () => {
    const result = normalizeCapabilities({
      capabilities: 'Hello,world',
      metadata: {
        capabilities: 'hello, foo,bar',
      },
    });
    result.should.deepEqual('Query, Hello, Foo, Bar, World');
  });

  it('use legacy "list"', () => {
    const result = normalizeCapabilities({
      metadata: {
        capabilities: { list: 'hello, foo,bar' },
      },
    });
    result.should.deepEqual('Query, Hello, Foo, Bar');
  });

  it('combine arrays from root-level and metadata object', () => {
    const result = normalizeCapabilities({
      capabilities: ['Hello', 'world'],
      metadata: {
        capabilities: ['hello', 'foo', 'bar'],
      },
    });
    result.should.deepEqual('Query, Hello, Foo, Bar, World');
  });

  it('combine objects from root-level and metadata object', () => {
    const result = normalizeCapabilities({
      capabilities: { hello: true, world: true, baz: false },
      metadata: {
        capabilities: { hello: true, foo: true, bar: true },
      },
    });
    result.should.deepEqual('Query, Hello, Foo, Bar, World');
  });

  it('handles absent capabilities', () => {
    const result = normalizeCapabilities({
      capabilities: { hello: true, world: true, baz: false },
    });
    result.should.deepEqual('Query, Hello, World');
  });

  it('skips numeric', () => {
    const result = normalizeCapabilities({
      capabilities: 3,
      metadata: {
        capabilities: ['hello', 'foo', 'bar'],
      },
    });
    result.should.deepEqual('Query, Hello, Foo, Bar');
  });
});
