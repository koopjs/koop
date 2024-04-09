const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {},
};

describe('geoservices error handling', () => {
  describe('handle errors coming from pull-data calls in generalHandler', () => {
    test('should return provider 500 error', async () => {
      const koop = new Koop({ logLevel: 'error', logger: mockLogger });
      koop.register(provider, {
        dataDir: './test/provider-data',
        // eslint-disable-next-line
        before: (req, callback) => {
          throw new Error('error in the provider');
        },
      });
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/polygon/FeatureServer/0/query',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          error: {
            code: 500,
            details: [],
            message: 'error in the provider',
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    test('should return 499 error', async () => {
      const koop = new Koop({ logLevel: 'error', logger: mockLogger });
      let auth = require('@koopjs/auth-direct-file')(
        'pass-in-your-secret',
        `${__dirname}/helpers/user-store.json`,
      );
      koop.register(auth);
      koop.register(provider, {
        dataDir: './test/provider-data',
      });
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/polygon/FeatureServer/0/query',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          error: {
            code: 499,
            details: ['Token Required'],
            message: 'Token Required',
            messageCode: 'GWM_0003',
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    test('should return 498 error', async () => {
      const koop = new Koop({ logLevel: 'error', logger: mockLogger });
      let auth = require('@koopjs/auth-direct-file')(
        'pass-in-your-secret',
        `${__dirname}/helpers/user-store.json`,
      );
      koop.register(auth);
      koop.register(provider, {
        dataDir: './test/provider-data',
      });
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/polygon/FeatureServer/0/query?token=999',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          error: {
            code: 498,
            details: [],
            message: 'Invalid token.',
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });

  describe('handle errors coming from authenticate calls in generateToken', () => {
    test('should return 498 error', async () => {
      const koop = new Koop({ logLevel: 'error', logger: mockLogger });
      let auth = require('@koopjs/auth-direct-file')(
        'pass-in-your-secret',
        `${__dirname}/helpers/user-store.json`,
      );
      koop.register(auth);
      koop.register(provider, {
        dataDir: './test/provider-data',
      });
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/generateToken',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          error: {
            code: 400,
            details: ['Invalid username or password.'],
            message: 'Unable to generate token.',
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});
