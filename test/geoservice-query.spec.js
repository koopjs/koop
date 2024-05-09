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

describe('Feature Server Output - query', () => {
  const koop = new Koop({ logLevel: 'error', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  describe('objectIds', () => {
    describe('using OBJECTID field', () => {
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
            `/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query?objectIds=${objectIds[1]}`, // eslint-disable-line
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
            `/file-geojson/rest/services/points-wo-objectid/FeatureServer/0/query?objectIds=${objectIds[1]},${objectIds[2]}`, // eslint-disable-line
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
          '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?WHERE=label+is+not+null', // eslint-disable-line
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
          '/file-geojson/rest/services/points-w-metadata-exceeded-transfer-limit/FeatureServer/0/query?resultRecordCount=2', // eslint-disable-line
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
          '/file-geojson/rest/services/points-w-metadata-exceeded-transfer-limit/FeatureServer/0/query', // eslint-disable-line
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

  describe('geometry', () => {
    describe('intersects', () => {
      describe('searchGeometry: envelope', () => {
        test('return multipolygon that intersects search envelope', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-130,"xmax":-110,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(1);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('return 0 when search envelope fails to intersect any features', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-10,"xmax":0,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(0);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
      describe('searchGeometry: multipolygon', () => {
        test('return multipolygon that intersects search multipolygon', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry=%7B%22rings%22%3A%5B%5B%5B-125,45%5D,%5B-120,45%5D,%5B-120,40%5D,%5B-125,40%5D,%5B-125,45%5D%5D,%5B%5B-116,37%5D,%5B-114,37%5D,%5B-114,36%5D,%5B-116,36%5D,%5B-116,37%5D%5D%5D%7D&geometryType=esriGeometryPolygon`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(1);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('return 0 when search envelope fails to intersect any features', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-10,"xmax":0,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(0);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
    });

    describe('intersects', () => {
      describe('searchGeometry: envelope', () => {
        test('return multipolygon that intersects search envelope', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-130,"xmax":-110,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(1);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('return 0 when search envelope fails to intersect any features', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-10,"xmax":0,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(0);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
      describe('searchGeometry: multipolygon', () => {
        test('return multipolygon that intersects search multipolygon', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry=%7B%22rings%22%3A%5B%5B%5B-125,45%5D,%5B-120,45%5D,%5B-120,40%5D,%5B-125,40%5D,%5B-125,45%5D%5D,%5B%5B-116,37%5D,%5B-114,37%5D,%5B-114,36%5D,%5B-116,36%5D,%5B-116,37%5D%5D%5D%7D&geometryType=esriGeometryPolygon`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(1);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        test('return 0 when search envelope fails to intersect any features', async () => {
          try {
            const response = await request(koop.server).get(
              `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-10,"xmax":0,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
            );
            expect(response.status).toBe(200);
            const { features } = response.body;
            expect(features.length).toBe(0);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
      });
    });

    describe('intersects', () => {
      test('return multipolygon that intersects search envelope', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-130,"xmax":-110,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(1);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });

      test('return 0 when search envelope fails to intersect any features', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-10,"xmax":0,"ymin":30,"ymax":38}&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(0);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    });

    describe('envelope-intersects', () => {
      test('return features if intersects the envelope of the search geometry', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/diagonal-feature/FeatureServer/0/query?geometry={"paths":[[[-96,53.4],[-93.9,53.4]]],"spatialReference":{"wkid":4326}}&geometryType=esriGeometryLine&spatialRel=esriSpatialRelEnvelopeIntersects`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(1);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
      test('return 0 features if none intersect the envelope of the search geometry', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/diagonal-feature/FeatureServer/0/query?geometry={"paths":[[[-96,53.4],[-94.9,53.4]]],"spatialReference":{"wkid":4326}}&geometryType=esriGeometryLine&spatialRel=esriSpatialRelEnvelopeIntersects`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(0);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    });

    describe('contains', () => {
      test('return multipolygon contained in search multipolygon', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry=%7B%22rings%22%3A%5B%5B%5B-125,45%5D,%5B-120,45%5D,%5B-120,40%5D,%5B-125,40%5D,%5B-125,45%5D%5D,%5B%5B-116,37%5D,%5B-114,37%5D,%5B-114,36%5D,%5B-116,36%5D,%5B-116,37%5D%5D%5D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelContains`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(1);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });

      test('return 0 when search envelope fails to contain any features', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry={"xmin":-10,"xmax":0,"ymin":30,"ymax":38}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelContains`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(0);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    });

    describe('within', () => {
      test('return features where search geometry is within feature', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry=%7B%22rings%22%3A%5B%5B%5B-122,44%5D,%5B-121,44%5D,%5B-121,41%5D,%5B-122,41%5D,%5B-125,44%5D%5D%5D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelWithin`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(1);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });

      test('return 0 when search geometry is not within any features', async () => {
        try {
          const response = await request(koop.server).get(
            `/file-geojson/rest/services/multi-polygon/FeatureServer/0/query?geometry=%7B%22rings%22%3A%5B%5B%5B-12,44%5D,%5B-11,44%5D,%5B-11,41%5D,%5B-12,41%5D,%5B-12,44%5D%5D%5D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelWithin`, // eslint-disable-line
          );
          expect(response.status).toBe(200);
          const { features } = response.body;
          expect(features.length).toBe(0);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    });
  });
});
