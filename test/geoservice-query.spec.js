const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {}
};

describe('koop', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });
  test('should return true', async () => {
    try {
      const response = await request(koop.server).get('/file-geojson/rest/services/polygon/FeatureServer/0/query');
      expect(response.status).toBe(200);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  describe('Feature Server', () => {
    describe('/query', () => {
      describe('objectIds', () => {
        test('handles empty value', async () => {
          try {
            const response = await request(koop.server).get('/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?objectIds=');
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(3);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        describe('using OBJECTID field', () => {
          test('handles single value', async () => {
            try {
              const response = await request(koop.server).get('/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?objectIds=2');
              expect(response.status).toBe(200);
              const { features } = response.body;
              expect(features.length).toBe(1);
              expect(features[0].attributes.OBJECTID).toBe(2);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });

          test('handles delimited values', async () => {
            try {
              const response = await request(koop.server).get('/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?objectIds=2,3');
              expect(response.status).toBe(200);
              const { features } = response.body;
              expect(features.length).toBe(2);
              expect(features[0].attributes.OBJECTID).toBe(2);
              expect(features[1].attributes.OBJECTID).toBe(3);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });
        });

        describe('using defined id field', () => {
          test('handles single value', async () => {
            try {
              const response = await request(koop.server).get('/file-geojson/rest/services/points-w-metadata-id/FeatureServer/0/query?objectIds=2');
              expect(response.status).toBe(200);
              const { features } = response.body;
              expect(features.length).toBe(1);
              expect(features[0].attributes.id).toBe(2);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });
  
          test('handles delimited values', async () => {
            try {
              const response = await request(koop.server).get('/file-geojson/rest/services/points-w-metadata-id/FeatureServer/0/query?objectIds=2,3');
              expect(response.status).toBe(200);
              const { features } = response.body;
              expect(features.length).toBe(2);
              expect(features[0].attributes.id).toBe(2);
              expect(features[1].attributes.id).toBe(3);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });
        });

        describe('without OBJECTID or idField', () => {
          let objectIds;
          beforeAll(async () => {
            const response = await request(koop.server).get('/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query');
            objectIds = response.body.features.map(feature => {
              return feature.attributes.OBJECTID;
            });
          });
              
          test('handles single value', async () => {
            try {
              const response = await request(koop.server).get(`/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query?objectIds=${objectIds[1]}`);
              expect(response.status).toBe(200);
              const { features } = response.body;
              expect(features.length).toBe(1);
              expect(features[0].attributes.OBJECTID).toBe(objectIds[1]);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });

          test('handles delimited values', async () => {
            try {
              const response = await request(koop.server).get(`/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query?objectIds=${objectIds[1]},${objectIds[2]}`);
              expect(response.status).toBe(200);
              const { features } = response.body;
              expect(features.length).toBe(2);
              expect(features[0].attributes.OBJECTID).toBe(objectIds[1]);
              expect(features[1].attributes.OBJECTID).toBe(objectIds[2]);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });
        });
      });
    });
  });
});
