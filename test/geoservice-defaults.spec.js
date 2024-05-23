const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const { CURRENT_VERSION, FULL_VERSION } = require('./helpers/client-response-fixtures');

describe('Geoservices defaults settings', () => {
  const koop = new Koop({
    logLevel: 'error',
    geoservicesDefaults: {
      currentVersion: CURRENT_VERSION,
      fullVersion: FULL_VERSION,
      layer: { supportedQueryFormats: 'JSON' },
    },
  });
  koop.register(provider, { dataDir: './test/provider-data' });
  test('should return server metadata with expected version', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/polygon/FeatureServer',
      );
      expect(response.status).toBe(200);
      expect(response.body.currentVersion).toBe(CURRENT_VERSION);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('should return layer metadata with expected version', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/polygon/FeatureServer/0',
      );
      expect(response.status).toBe(200);
      expect(response.body.currentVersion).toBe(CURRENT_VERSION);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('should return layer metadata with expected "supportedQueryFormats"', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/polygon/FeatureServer/0',
      );
      expect(response.status).toBe(200);
      expect(response.body.supportedQueryFormats).toBe('JSON');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
