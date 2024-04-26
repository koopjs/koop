const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const FeatureCollection = require('./helpers/FeatureCollection.proto').esriPBuffer
  .FeatureCollectionPBuffer;
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
    describe('/query?f=pbf', () => {
      test('request as PBF', async () => {
        try {
          const response = await request(koop.server)
            .get(
              '/file-geojson/rest/services/points-w-objectid/FeatureServer/0/query?f=pbf&resultRecordCount=1',
            )
            .responseType('blob')
            .buffer();
          const decodedBuffer = FeatureCollection.decode(response.body);
          const pbfJson = FeatureCollection.toObject(decodedBuffer);
          expect(response.status).toBe(200);
          expect(response.headers['content-disposition']).toBe('inline;filename=results.pbf');
          expect(response.headers['content-type']).toBe('application/x-protobuf');
          expect(response.headers['content-length']).toBe('229');
          expect(pbfJson).toEqual({
            queryResult: {
              featureResult: {
                exceededTransferLimit: true,
                objectIdFieldName: 'OBJECTID',
                uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
                geometryType: 0,
                spatialReference: { wkid: 4326 },
                transform: {
                  scale: { xScale: 1e-9, yScale: 1e-9 },
                  translate: { xTranslate: 0, yTranslate: 0 },
                },
                fields: [
                  { name: 'OBJECTID', fieldType: 6, alias: 'OBJECTID' },
                  { name: 'category', fieldType: 4, alias: 'category' },
                  { name: 'label', fieldType: 4, alias: 'label' },
                  { name: 'timestamp', fieldType: 5, alias: 'timestamp' },
                ],
                features: [
                  {
                    attributes: [
                      { uintValue: 1 },
                      { stringValue: 'pinto' },
                      { stringValue: 'White Leg' },
                      {
                        sint64Value: {
                          low: 1811117264,
                          high: 391,
                          unsigned: false,
                        },
                      },
                    ],
                    geometry: {
                      lengths: [2],
                      coords: [
                        { low: 1604378624, high: -19, unsigned: false },
                        { low: 769803776, high: -6, unsigned: false },
                      ],
                    },
                  },
                ],
              },
            },
          });
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    });
  });
});
