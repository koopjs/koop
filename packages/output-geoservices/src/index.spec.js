const OutputGeoServices = require('./index');
const FeatureServer = require('@koopjs/featureserver');

// test.js
jest.mock('@koopjs/featureserver', () => ({
  setLogger: jest.fn(),
  route: jest.fn(),
}));

const loggerMock = {
  silly: () => {},
  error: () => {}
};

const modelMock = {
  pull: jest.fn((req, callback) => callback(null, 'someData')),
};

const resMock = {
  status: jest.fn(() => {
    return resMock;
  }),
  json: jest.fn(),
};

const reqMock = {
  headers: {
    host: 'some-host.com',
  },
  baseUrl: '/api/v1',
  query: {},
  body: {},
};

describe('Output Geoservices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should include expected static properties', () => {
      expect(OutputGeoServices.type).toBe('output');
      expect(OutputGeoServices.version).toBe(
        require('../package.json').version,
      );
      expect(OutputGeoServices.routes).toEqual([
        {
          path: '$namespace/rest/info',
          methods: ['get', 'post'],
          handler: 'restInfoHandler',
        },
        {
          path: '$namespace/tokens/:method',
          methods: ['get', 'post'],
          handler: 'generateToken',
        },
        {
          path: '$namespace/tokens/',
          methods: ['get', 'post'],
          handler: 'generateToken',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method',
          methods: ['get', 'post'],
          handler: 'generalHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
          methods: ['get', 'post'],
          handler: 'generalHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
          methods: ['get', 'post'],
          handler: 'generalHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer',
          methods: ['get', 'post'],
          handler: 'generalHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer*',
          methods: ['get', 'post'],
          handler: 'generalHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/MapServer*',
          methods: ['get', 'post'],
          handler: 'generalHandler',
        },
      ]);
    });

    test('should include expected default properties', () => {
      const output = new OutputGeoServices(modelMock);
      expect(output.options).toEqual({});
      expect(output.logger).toBeDefined();
      expect(output.authInfo).toEqual({});
      expect(FeatureServer.setLogger.mock.calls.length).toBe(1);
    });

    test('should include properties with optional set values', () => {
      const output = new OutputGeoServices(modelMock, {
        logger: loggerMock,
        authInfo: { food: 'baz' },
      });
      expect(Object.keys(output.logger)).toEqual(['silly', 'error']);
      expect(output.authInfo).toEqual({ food: 'baz' });
      expect(FeatureServer.setLogger.mock.calls.length).toBe(1);
    });
  });

  describe('generalHandler', () => {
    test('should pull data and route', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.route.mock.calls.length).toBe(1);
      expect(FeatureServer.route.mock.calls[0]).toEqual([
        { foo: 'bar' },
        resMock,
        'someData',
      ]);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    test('should authorize, then pull data and route', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.route.mock.calls.length).toBe(1);
      expect(FeatureServer.route.mock.calls[0]).toEqual([
        { foo: 'bar' },
        resMock,
        'someData',
      ]);
    });

    test('should handle 5xx error', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) =>
          callback({ code: 503, message: 'Upstream error' }),
        ),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 503,
            details: [],
            message: 'Upstream error',
          },
        },
      ]);
    });

    test('should handle code-less error', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) =>
          callback({ message: 'Upstream error' }),
        ),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 500,
            details: [],
            message: 'Upstream error',
          },
        },
      ]);
    });

    test('should handle required token error', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(() => {
          const err = new Error('no token');
          err.code = 401;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 499,
            details: [],
            message: 'Token Required',
          },
        },
      ]);
    });

    test('should handle invalid token error', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(() => {
          const err = new Error('invalid token');
          err.code = 401;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler(
        { headers: { authorization: '123' } },
        resMock,
      );
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 498,
            details: [],
            message: 'Invalid token.',
          },
        },
      ]);
    });

    test('should handle invalid token error', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(() => {
          const err = new Error('Forbidden');
          err.code = 403;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler(
        { headers: { authorization: '123' } },
        resMock,
      );
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 400,
            details: [],
            message: 'Item does not exist or is inaccessible.',
            messageCode: 'CONT_0001',
          },
        },
      ]);
    });

    test('should handle ArcGIS type-error', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) =>
          callback({ error: { message: 'Upstream error' } }),
        ),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generalHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 500,
            details: [],
            message: 'Upstream error',
          },
        },
      ]);
    });
  });

  describe('restInfoHandler', () => {
    test('should return rest info', async () => {
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.restInfoHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.route.mock.calls.length).toBe(1);
      expect(FeatureServer.route.mock.calls[0]).toEqual([
        { foo: 'bar' },
        resMock,
        { authInfo: { food: 'baz' } },
      ]);
    });

    test('should return rest info with auth specification', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticationSpecification: {},
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.route.mock.calls.length).toBe(1);
      expect(FeatureServer.route.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: {
            food: 'baz',
            isTokenBasedSecurity: true,
            tokenServicesUrl: 'https://some-host.com/api/v1/undefined/tokens/',
          },
        },
      ]);
    });

    test('should return rest info with auth specification, http', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticationSpecification: { useHttp: true },
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.route.mock.calls.length).toBe(1);
      expect(FeatureServer.route.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: {
            food: 'baz',
            isTokenBasedSecurity: true,
            tokenServicesUrl: 'http://some-host.com/api/v1/undefined/tokens/',
          },
        },
      ]);
    });
  });

  describe('generateToken', () => {
    test('should generate token', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticate: jest.fn(() => {
          return { token: 'abc' };
        })
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([{
        ssl: false,
        token: 'abc'
      }]);
    });
    
    test('should message that there is no authenticate method', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([500]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([{
        error: '"authenticate" not implemented for this provider'
      }]);
    });

    test('should fail to generate token due to 401', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticate: jest.fn(() => {
          const err = new Error('bad creds');
          err.code = 401;
          throw err;
        })
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([{
        error: {
          code: 400,
          details: ['Invalid username or password.'],
          message: 'Unable to generate token.'
        }
      }]);
    });

    test('should fail to generate token due to credentials', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticate: jest.fn(() => {
          const err = {
            error: {
              code: 400,
              message: 'Unable to generate token.'
            }
          };
          throw err;
        })
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([{
        error: {
          code: 400,
          details: ['Invalid username or password.'],
          message: 'Unable to generate token.'
        }
      }]);
    });

    test('should fail to generate token due to 5xx', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticate: jest.fn(() => {
          const err = new Error('upstream');
          err.code = 503;
          throw err;
        })
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([{
        error: {
          code: 503,
          details: [],
          message: 'upstream'
        }
      }]);
    });

    test('should fail to generate token due to 500', async () => {
      const modelMock = {
        pull: jest.fn((req, callback) => callback(null, 'someData')),
        authorize: jest.fn(),
        authenticate: jest.fn(() => {
          const err = new Error('upstream');
          throw err;
        })
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([{
        error: {
          code: 500,
          details: [],
          message: 'upstream'
        }
      }]);
    });
  });
});
