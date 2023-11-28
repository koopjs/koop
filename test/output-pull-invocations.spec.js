const Koop = require('@koopjs/koop-core');
const noCallbackProvider = require('./helpers/provider-async-no-callback');
const output = require('./helpers/output-pull-with-callback');

const request = require('supertest');
const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {},
};

describe('test output using model.pull with callback arg', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(output);
  koop.register(noCallbackProvider);

  test('should return data', async () => {
    try {
      const response = await request(koop.server).get(
        '/async-no-callback/output-path',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        features: [
          {
            geometry: { coordinates: [-104.01, 39.94], type: 'Point' },
            properties: {},
            type: 'Feature',
          },
        ],
        type: 'FeatureCollection',
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
