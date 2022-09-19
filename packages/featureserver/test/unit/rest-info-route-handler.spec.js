const should = require('should') // eslint-disable-line
const restInfo = require('../../lib/rest-info-route-handler');

describe('rest/info handler', () => {
  it('should return default info', () => {
    const req = {
      app: {
        locals: {}
      }
    };
    const result = restInfo({}, req);
    result.should.deepEqual({
      currentVersion: 10.51,
      fullVersion: '10.5.1'
    });
  });

  it('should return default plus supplied info', () => {
    const data = {
      hello: {
        world: true
      }
    };
    const req = {
      app: {
        locals: {}
      }
    };
    const result = restInfo(data, req);
    result.should.deepEqual({
      currentVersion: 10.51,
      fullVersion: '10.5.1',
      hello: {
        world: true
      }
    });
  });

  it('should return versions from app.locals', () => {
    const req = {
      app: {
        locals: {
          config: {
            featureServer: {
              currentVersion: 10.81,
              fullVersion: '10.8.1'
            }
          }
        }
      }
    };
    const result = restInfo({}, req);
    result.should.deepEqual({
      currentVersion: 10.81,
      fullVersion: '10.8.1'
    });
  });
});
