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

describe('koop', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  describe('Feature Server - layer metadata', () => {
    test('handles supportedQueryFormats override', async () => {
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/points-w-metadata-query-formats/FeatureServer/0',
        );
        expect(response.status).toBe(200);
        const { supportedQueryFormats } = response.body;
        expect(supportedQueryFormats).toBe('JSON');
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    test('handles labelingInfo override', async () => {
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/points-w-metadata-labeling-info/FeatureServer/0',
        );
        expect(response.status).toBe(200);
        const {
          drawingInfo: { labelingInfo },
        } = response.body;
        expect(labelingInfo).toBe('label-spec');
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});
