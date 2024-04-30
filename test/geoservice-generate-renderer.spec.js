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

describe('Feature Server Output - /generateRenderer', () => {
  const koop = new Koop({ logLevel: 'debug', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  test('return expected success result', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/generateRenderer',
      );
      expect(response.status).toBe(200);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
