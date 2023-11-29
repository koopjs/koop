const Koop = require('@koopjs/koop-core');
const noCallbackProvider = require('./helpers/provider-async-no-callback');
const asyncCallbackProvider = require('./helpers/provider-async-with-callback');
const callbackProvider = require('./helpers/provider-callback');
const request = require('supertest');
const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {},
};

describe('test different provider getData forms', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(noCallbackProvider);
  koop.register(asyncCallbackProvider);
  koop.register(callbackProvider);

  test('should return data from provider with async, no-callback getData method', async () => {
    try {
      const response = await request(koop.server).get(
        '/async-no-callback/rest/services/FeatureServer/0/query',
      );
      expect(response.status).toBe(200);
      expect(response.body.features).toEqual([
        {
          attributes: { OBJECTID: 1 },
          geometry: { x: -104.01, y: 39.94 },
        },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('should return data from provider with async, callback getData method', async () => {
    try {
      const response = await request(koop.server).get(
        '/async-with-callback/rest/services/FeatureServer/0/query',
      );
      expect(response.status).toBe(200);
      expect(response.body.features).toEqual([
        {
          attributes: { OBJECTID: 1 },
          geometry: { x: -104.01, y: 39.94 },
        },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('should return data from provider with callback getData method', async () => {
    try {
      const response = await request(koop.server).get(
        '/with-callback/rest/services/FeatureServer/0/query',
      );
      expect(response.status).toBe(200);
      expect(response.body.features).toEqual([
        {
          attributes: { OBJECTID: 1 },
          geometry: { x: -104.01, y: 39.94 },
        },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
