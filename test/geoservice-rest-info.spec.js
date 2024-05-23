const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const { FULL_VERSION, CURRENT_VERSION } = require('./helpers/client-response-fixtures');
const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {},
};

describe('Feature Server Output - rest/info', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  test('return expected success result', async () => {
    try {
      const response = await request(koop.server).get('/file-geojson/rest/info');
      expect(response.status).toBe(200);
      const {
        body: {
          authInfo: { isTokenBasedSecurity, tokenServicesUrl },
          currentVersion,
          fullVersion,
        },
      } = response;

      expect(isTokenBasedSecurity).toBe(true);
      expect(tokenServicesUrl).toMatch(/file-geojson\/rest\/generateToken$/);
      expect(currentVersion).toBe(CURRENT_VERSION);
      expect(fullVersion).toBe(FULL_VERSION);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('return expected 400 result', async () => {
    try {
      const response = await request(koop.server).get('/file-geojson/rest/info?f=jsonb');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        error: {
          code: 400,
          details: [],
          message: 'Invalid format',
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
