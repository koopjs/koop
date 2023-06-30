const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');

describe('koop', () => {
  const koop = new Koop({ logLevel: 'error' });
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
            const response = await request(koop.server).get('/file-geojson/rest/services/points-01/FeatureServer/0/query?objectIds=');
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
              const response = await request(koop.server).get('/file-geojson/rest/services/points-01/FeatureServer/0/query?objectIds=2');
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
              const response = await request(koop.server).get('/file-geojson/rest/services/points-01/FeatureServer/0/query?objectIds=2,3');
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
              const response = await request(koop.server).get('/file-geojson/rest/services/points-02/FeatureServer/0/query?objectIds=2');
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
              const response = await request(koop.server).get('/file-geojson/rest/services/points-02/FeatureServer/0/query?objectIds=2,3');
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

        test('400 error on invalid value', async () => {
          try {
            const response = await request(koop.server).get('/file-geojson/rest/services/points-01/FeatureServer/0/query?objectIds=1.4');
            expect(response.status).toBe(200);
            const { error } = response.body;
            expect(error.message).toBe('Non-integer objectId: 1.4');
            expect(error.code).toBe(400);
            expect(error.details).toEqual(['Non-integer objectId: 1.4']);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
    });
  });
});
