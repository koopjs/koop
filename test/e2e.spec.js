const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');

describe('koop', () => {
  const koop = new Koop({ dataDir: './provider-data' });
  koop.register(provider);
  test('should return true', async () => {
    try {
      const response = await request(koop.server).get('/file-geojson/rest/services/polygon/FeatureServer/0/query');
      expect(response.status).toBe(200);
    } catch (error) {
      fail(error);
    }
  });
});
