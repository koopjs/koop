const should = require('should'); // eslint-disable-line
const restInfo = require('./rest-info-route-handler');
const CURRENT_VERSION = 11.1;
const FULL_VERSION = '11.1.0';

describe('rest/info handler', () => {
  it('should return default info', () => {
    const req = {
      app: {
        locals: {},
      },
    };
    const result = restInfo(undefined, req);
    result.should.deepEqual({
      currentVersion: CURRENT_VERSION,
      fullVersion: FULL_VERSION,
      authInfo: {},
      owningSystemUrl: undefined,
    });
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
    const result = restInfo(data, req);
    result.should.deepEqual({
      currentVersion: CURRENT_VERSION,
      fullVersion: FULL_VERSION,
      authInfo: { foo: 'bar' },
      owningSystemUrl: 'helloworld',
    });
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
    const result = restInfo(
      { authInfo: { foo: 'bar' }, owningSystemUrl: 'helloworld' },
      req,
    );
    result.should.deepEqual({
      currentVersion: 10.81,
      fullVersion: '10.8.1',
      authInfo: {
        foo: 'bar',
      },
      owningSystemUrl: 'helloworld',
    });
  });
});
