const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');

describe('Geoservices defaults settings', () => {
  const koop = new Koop({ logLevel: 'error', geoservicesDefaults: { currentVersion: 11.2, fullVersion: '11.2.0' } });
  koop.register(provider, { dataDir: './test/provider-data' });
  test('should return server metadata with expected version', async () => {
    try {
      const response = await request(koop.server).get('/file-geojson/rest/services/polygon/FeatureServer');
      expect(response.status).toBe(200);
      expect(response.body.currentVersion).toBe(11.2);
      expect(response.body.fullVersion).toBe('11.2.0');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('should return layer metadata with expected version', async () => {
    try {
      const response = await request(koop.server).get('/file-geojson/rest/services/polygon/FeatureServer/0');
      expect(response.status).toBe(200);
      expect(response.body.currentVersion).toBe(11.2);
      expect(response.body.fullVersion).toBe('11.2.0');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
