const OutputGeoServices = require('./index');
const FeatureServer = require('@koopjs/featureserver');

jest.mock('@koopjs/featureserver', () => ({
  setLogger: jest.fn(),
  setDefaults: jest.fn(),
  restInfo: jest.fn(),
  serverInfo: jest.fn(),
  layersInfo: jest.fn(),
  layerInfo: jest.fn(),
  query: jest.fn(),
  generateRenderer: jest.fn(),
  queryRelatedRecords: jest.fn(),
  validateStatisticsRequest: jest.requireActual('@koopjs/featureserver').validateStatisticsRequest,
}));

const loggerMock = {
  silly: () => {},
  error: () => {},
};

const modelMock = {
  namespace: 'provider-name',
  pull: jest.fn(async () => 'someData'),
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
      expect(OutputGeoServices.version).toBe(require('../package.json').version);
      expect(OutputGeoServices.routes).toEqual([
        {
          path: '$namespace/rest/info',
          methods: ['get', 'post'],
          handler: 'restInfoHandler',
        },
        {
          path: '$namespace/rest/generateToken',
          methods: ['get', 'post'],
          handler: 'generateToken',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer',
          methods: ['get', 'post'],
          handler: 'serverInfoHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
          methods: ['get', 'post'],
          handler: 'layersInfoHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
          methods: ['get', 'post'],
          handler: 'layerInfoHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/info',
          methods: ['get', 'post'],
          handler: 'layerInfoHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/query',
          methods: ['get', 'post'],
          handler: 'queryHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/generateRenderer',
          methods: ['get', 'post'],
          handler: 'generateRendererHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/queryRelatedRecords',
          methods: ['get', 'post'],
          handler: 'queryRelatedRecordsHandler',
        },
        {
          path: '$namespace/rest/services/$providerParams/MapServer*',
          methods: ['get', 'post'],
          handler: 'invalidUrlHandler',
        },
      ]);
    });
  });

  describe('error handling', () => {
    test('should handle Invalid URL', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.invalidUrlHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 400,
            details: ['Invalid URL'],
            message: 'Invalid URL',
          },
        },
      ]);
    });

    test('should handle code-less error', async () => {
      const modelMock = {
        pull: jest.fn(async () => {
          throw new Error('Upstream error');
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler(reqMock, resMock);
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
        pull: jest.fn(async () => {
          const err = new Error('no token');
          err.code = 401;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 499,
            details: ['Token Required'],
            message: 'Token Required',
            messageCode: 'GWM_0003',
          },
        },
      ]);
    });

    test('should handle invalid token error', async () => {
      const modelMock = {
        pull: jest.fn(async () => {
          const err = new Error('invalid token');
          err.code = 401;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler({ headers: { authorization: '123' } }, resMock);
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
        pull: jest.fn(async () => {
          const err = new Error('Forbidden');
          err.code = 403;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler({ headers: { authorization: '123' } }, resMock);
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
        pull: jest.fn(async () => {
          throw new Error('Upstream error');
        }),
      };
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler(reqMock, resMock);
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
    test('should return rest info authInfo override', async () => {
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: { food: 'baz' },
        },
      ]);
    });

    test('should return rest info with default authInfo, default https token url', async () => {
      const modelMock = {
        namespace: 'provider-name',
        pull: jest.fn(async () => 'someData'),
      };
      const output = new OutputGeoServices(modelMock);
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: {
            isTokenBasedSecurity: true,
            tokenServicesUrl: 'https://some-host.com/api/v1/provider-name/rest/generateToken',
          },
        },
      ]);
    });

    test('should set by option', async () => {
      const modelMock = {
        namespace: 'provider-name',
        pull: jest.fn(async () => 'someData'),
      };
      const output = new OutputGeoServices(modelMock, {
        useHttpForTokenUrl: true,
      });
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: {
            isTokenBasedSecurity: true,
            tokenServicesUrl: 'http://some-host.com/api/v1/provider-name/rest/generateToken',
          },
        },
      ]);
    });

    test('should set owningSystemUrl', async () => {
      const modelMock = {
        namespace: 'provider-name',
        pull: jest.fn(async () => 'someData'),
      };
      const output = new OutputGeoServices(modelMock, {
        useHttpForTokenUrl: true,
        includeOwningSystemUrl: true,
      });
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: {
            isTokenBasedSecurity: true,
            tokenServicesUrl: 'http://some-host.com/api/v1/provider-name/rest/generateToken',
          },
          owningSystemUrl: 'http://some-host.com/api/v1/provider-name',
        },
      ]);
    });
    test('should set by GEOSERVICES_HTTP', async () => {
      const modelMock = {
        namespace: 'provider-name',
        pull: jest.fn(async () => 'someData'),
      };
      try {
        process.env.GEOSERVICES_HTTP = 'true';
        const output = new OutputGeoServices(modelMock);
        await output.restInfoHandler(reqMock, resMock);
        expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
        expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
          reqMock,
          resMock,
          {
            authInfo: {
              isTokenBasedSecurity: true,
              tokenServicesUrl: 'http://some-host.com/api/v1/provider-name/rest/generateToken',
            },
          },
        ]);
      } catch (error) {
        expect(error).toBeUndefined();
      } finally {
        delete process.env.GEOSERVICES_HTTP;
      }
    });

    test('should set by KOOP_AUTH_HTTP', async () => {
      const modelMock = {
        namespace: 'provider-name',
        pull: jest.fn(async () => 'someData'),
      };
      try {
        process.env.KOOP_AUTH_HTTP = 'true';
        const output = new OutputGeoServices(modelMock);
        await output.restInfoHandler(reqMock, resMock);
        expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
        expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
          reqMock,
          resMock,
          {
            authInfo: {
              isTokenBasedSecurity: true,
              tokenServicesUrl: 'http://some-host.com/api/v1/provider-name/rest/generateToken',
            },
          },
        ]);
      } catch (error) {
        expect(error).toBeUndefined();
      } finally {
        delete process.env.KOOP_AUTH_HTTP;
      }
    });

    test('should set with authenticationSpecification', async () => {
      const modelMock = {
        namespace: 'provider-name',
        pull: jest.fn(async () => 'someData'),
        authenticationSpecification: () => {
          return { useHttp: true };
        },
      };

      const output = new OutputGeoServices(modelMock);
      await output.restInfoHandler(reqMock, resMock);
      expect(FeatureServer.restInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.restInfo.mock.calls[0]).toEqual([
        reqMock,
        resMock,
        {
          authInfo: {
            isTokenBasedSecurity: true,
            tokenServicesUrl: 'http://some-host.com/api/v1/provider-name/rest/generateToken',
          },
        },
      ]);
    });

    test('should handle 5xx error', async () => {
      const modelMock = {
        pull: jest.fn(async () => {
          const error = new Error('Upstream error');
          error.code = 503;
          throw error;
        }),
      };

      FeatureServer.restInfo.mockImplementation(() => {
        throw new Error('some error');
      });
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.restInfoHandler(reqMock, resMock);
      expect(resMock.status.mock.calls[0].length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls[0].length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 500,
            details: [],
            message: 'some error',
          },
        },
      ]);
    });
  });

  describe('serverInfoHandler', () => {
    test('should pull data and call handler', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.serverInfoHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.serverInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.serverInfo.mock.calls[0]).toEqual([{ foo: 'bar' }, resMock, 'someData']);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    test('should handle 5xx error', async () => {
      const modelMock = {
        pull: jest.fn(async () => {
          const error = new Error('Upstream error');
          error.code = 503;
          throw error;
        }),
      };

      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.serverInfoHandler(reqMock, resMock);
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
  });

  describe('layersInfoHandler', () => {
    test('should pull data and call handler', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.layersInfoHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.layersInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.layersInfo.mock.calls[0]).toEqual([{ foo: 'bar' }, resMock, 'someData']);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    test('should handle 5xx error', async () => {
      const modelMock = {
        pull: jest.fn(async () => {
          const error = new Error('Upstream error');
          error.code = 503;
          throw error;
        }),
      };

      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.layersInfoHandler(reqMock, resMock);
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
  });

  describe('layerInfoHandler', () => {
    test('should pull data and call handler', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.layerInfoHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.layerInfo.mock.calls.length).toBe(1);
      expect(FeatureServer.layerInfo.mock.calls[0]).toEqual([{ foo: 'bar' }, resMock, 'someData']);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    test('should handle 5xx error', async () => {
      const modelMock = {
        pull: jest.fn(async () => {
          const error = new Error('Upstream error');
          error.code = 503;
          throw error;
        }),
      };

      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.layerInfoHandler(reqMock, resMock);
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
  });

  describe('queryHandler', () => {
    test('should pull data and call handler', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.query.mock.calls.length).toBe(1);
      expect(FeatureServer.query.mock.calls[0]).toEqual([{ foo: 'bar' }, resMock, 'someData']);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });

    const validStatistic = {
      onStatisticField: 'foo',
      outStatisticFieldName: 'total',
      statisticType: 'sum',
    };

    ['body', 'query'].forEach((source) => {
      ['outStatisticFieldName', 'onStatisticField', 'statisticType', 'groupByField'].forEach(
        (field) => {
          test(`should reject invalid ${field} in ${source} before pulling data`, async () => {
            const logger = { ...loggerMock, error: jest.fn() };
            const output = new OutputGeoServices(modelMock, { logger });
            const req = {
              ...reqMock,
              [source]: {
                outStatistics: JSON.stringify([
                  field === 'groupByField'
                    ? validStatistic
                    : { ...validStatistic, [field]: 'invalid!' },
                ]),
                groupByFieldsForStatistics: field === 'groupByField' ? 'foo, invalid!' : 'foo',
              },
            };

            await output.queryHandler(req, resMock);

            expect(modelMock.pull).not.toHaveBeenCalled();
            expect(FeatureServer.query).not.toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ code: 400 }));
            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
              error: {
                code: 400,
                details: [],
                message: expect.stringContaining(
                  `Invalid configuration: ${field} "invalid!" is invalid.`,
                ),
              },
            });
          });
        },
      );
    });

    test('should reject invalid groupBy without statistics before pulling data', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler(
        { ...reqMock, query: { groupByFieldsForStatistics: 'invalid!' } },
        resMock,
      );
      expect(modelMock.pull).not.toHaveBeenCalled();
      expect(FeatureServer.query).not.toHaveBeenCalled();
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.objectContaining({ code: 400 }),
      });
    });

    test('should reject malformed statistics before pulling data', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryHandler({ ...reqMock, query: { outStatistics: 'not-json' } }, resMock);
      expect(modelMock.pull).not.toHaveBeenCalled();
      expect(FeatureServer.query).not.toHaveBeenCalled();
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.objectContaining({ code: 400 }),
      });
    });

    test('should preserve valid body parameters when query values are empty', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      const req = {
        ...reqMock,
        body: { outStatistics: [validStatistic], groupByFieldsForStatistics: ' foo, bar ' },
        query: { outStatistics: '', groupByFieldsForStatistics: '' },
      };
      await output.queryHandler(req, resMock);
      expect(modelMock.pull).toHaveBeenCalledWith(req);
      expect(FeatureServer.query).toHaveBeenCalledWith(req, resMock, 'someData');
    });

    test('should honor query precedence without mutating valid request parameters', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      const req = {
        ...reqMock,
        body: { outStatistics: [{ ...validStatistic, statisticType: 'invalid!' }] },
        query: {
          outStatistics: JSON.stringify([validStatistic]),
          groupByFieldsForStatistics: ' foo, bar ',
        },
      };
      const original = JSON.parse(JSON.stringify(req));
      await output.queryHandler(req, resMock);
      expect(modelMock.pull).toHaveBeenCalledWith(req);
      expect(FeatureServer.query).toHaveBeenCalledWith(req, resMock, 'someData');
      expect(req).toEqual(original);
    });
  });

  describe('generateRendererHandler', () => {
    test('should pull data and call handler', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.generateRendererHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.generateRenderer.mock.calls.length).toBe(1);
      expect(FeatureServer.generateRenderer.mock.calls[0]).toEqual([
        { foo: 'bar' },
        resMock,
        'someData',
      ]);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });
  });

  describe('queryRelatedRecordsHandler', () => {
    test('should pull data and call handler', async () => {
      const output = new OutputGeoServices(modelMock, { logger: loggerMock });
      await output.queryRelatedRecordsHandler({ foo: 'bar' }, resMock);
      expect(FeatureServer.queryRelatedRecords.mock.calls.length).toBe(1);
      expect(FeatureServer.queryRelatedRecords.mock.calls[0]).toEqual([
        { foo: 'bar' },
        resMock,
        'someData',
      ]);
      expect(modelMock.pull.mock.calls.length).toBe(1);
      expect(modelMock.pull.mock.calls[0][0]).toEqual({ foo: 'bar' });
    });
  });

  describe('generateToken', () => {
    test('should generate token', async () => {
      const modelMock = {
        pull: jest.fn(async () => 'someData'),
        authenticate: jest.fn(() => {
          return { token: 'abc' };
        }),
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          token: 'abc',
        },
      ]);
    });

    test('should fail to generate token due to 401', async () => {
      const modelMock = {
        pull: jest.fn(async () => 'someData'),
        authenticate: jest.fn(() => {
          const err = new Error('bad creds');
          err.code = 401;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 400,
            details: ['Invalid username or password.'],
            message: 'Unable to generate token.',
          },
        },
      ]);
    });

    test('should fail to generate token due to credentials', async () => {
      const modelMock = {
        pull: jest.fn(async () => 'someData'),
        authenticate: jest.fn(() => {
          const err = {
            error: {
              code: 400,
              message: 'Unable to generate token.',
            },
          };
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 400,
            details: ['Invalid username or password.'],
            message: 'Unable to generate token.',
          },
        },
      ]);
    });

    test('should fail to generate token due to 5xx', async () => {
      const modelMock = {
        pull: jest.fn(async () => 'someData'),
        authenticate: jest.fn(() => {
          const err = new Error('upstream');
          err.code = 503;
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 503,
            details: [],
            message: 'upstream',
          },
        },
      ]);
    });

    test('should fail to generate token due to 500', async () => {
      const modelMock = {
        pull: jest.fn(async () => 'someData'),
        authenticate: jest.fn(() => {
          const err = new Error('upstream');
          throw err;
        }),
      };
      const output = new OutputGeoServices(modelMock, {
        authInfo: { food: 'baz' },
      });
      await output.generateToken(reqMock, resMock);
      expect(resMock.status.mock.calls.length).toBe(1);
      expect(resMock.status.mock.calls[0]).toEqual([200]);
      expect(resMock.json.mock.calls.length).toBe(1);
      expect(resMock.json.mock.calls[0]).toEqual([
        {
          error: {
            code: 500,
            details: [],
            message: 'upstream',
          },
        },
      ]);
    });
  });
});
