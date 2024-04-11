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

describe('Feature Server Output - rest/info', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  test('return expected result', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/info',
      );
      expect(response.status).toBe(200);
      const {
        body: {
          authInfo: { isTokenBasedSecurity, tokenServicesUrl },
          currentVersion,
          fullVersion,
          owningSystemUrl,
        },
      } = response;

      expect(isTokenBasedSecurity).toBe(true);
      expect(tokenServicesUrl).toMatch(/file-geojson\/rest\/generateToken$/);
      expect(currentVersion).toBe(11.2);
      expect(fullVersion).toBe('11.2.0');
      expect(owningSystemUrl).toMatch(/file-geojson$/);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
