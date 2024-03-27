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

  describe('Feature Server', () => {
    describe('/query', () => {
      describe('objectIds', () => {
        test('handles empty value', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?objectIds=',
            );
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
              const response = await request(koop.server).get(
                '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?objectIds=2',
              );
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
              const response = await request(koop.server).get(
                '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?objectIds=2,3',
              );
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
              const response = await request(koop.server).get(
                '/file-geojson/rest/services/points-w-metadata-id/FeatureServer/0/query?objectIds=2',
              );
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
              const response = await request(koop.server).get(
                '/file-geojson/rest/services/points-w-metadata-id/FeatureServer/0/query?objectIds=2,3',
              );
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
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query',
            );
            objectIds = response.body.features.map((feature) => {
              return feature.attributes.OBJECTID;
            });
          });

          test('handles single value', async () => {
            try {
              const response = await request(koop.server).get(
                `/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query?objectIds=${objectIds[1]}`,
              );
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
              const response = await request(koop.server).get(
                `/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query?objectIds=${objectIds[1]},${objectIds[2]}`,
              );
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

      describe('where', () => {
        test('handle query with "+" as whitespace', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?WHERE=label+is+not+null',
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(3);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });

      describe('resultRecordCount', () => {
        test('should respect resultRecordCount applied from winnow', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?resultRecordCount=2',
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(2);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('should respect resultRecordCount applied from passthrough provider', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/pass-through/FeatureServer/0/query?resultRecordCount=3',
            );
            expect(response.status).toBe(200);
            const { features, exceededTransferLimit } = response.body;
            expect(features.length).toBe(3);
            expect(exceededTransferLimit).toBe(true);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });

      describe('exceededTransferLimit', () => {
        test('should be calculated by Koop and equal true', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?resultRecordCount=2',
            );
            expect(response.status).toBe(200);
            const { features, exceededTransferLimit } = response.body;
            expect(features.length).toBe(2);
            expect(exceededTransferLimit).toBe(true);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('should be calculated by Koop and equal false', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query',
            );
            expect(response.status).toBe(200);
            const { features, exceededTransferLimit } = response.body;
            expect(features.length).toBe(3);
            expect(exceededTransferLimit).toBe(false);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('should be acquired from provider metadata', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-metadata-exceeded-transfer-limit/FeatureServer/0/query?resultRecordCount=2',
            );
            expect(response.status).toBe(200);
            const { features, exceededTransferLimit } = response.body;
            expect(features.length).toBe(2);
            expect(exceededTransferLimit).toBe(true);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('should be acquired from provider metadata', async () => {
          try {
            const response = await request(koop.server).get(
              '/file-geojson/rest/services/points-w-metadata-exceeded-transfer-limit/FeatureServer/0/query',
            );
            expect(response.status).toBe(200);
            const { features, exceededTransferLimit } = response.body;
            expect(features.length).toBe(3);
            expect(exceededTransferLimit).toBe(true);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
    });
  });
});
