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

describe('Feature Server Output - /queryRelatedRecords', () => {
  const koop = new Koop({ logLevel: 'debug', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  test('return empty result when no classification def is sent', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/points-w-number-attr/FeatureServer/0/queryRelatedRecords',
      );

      expect(response.body).toEqual({
        relatedRecordGroups: [{}, {}, {}],
        fields: [
          {
            name: 'OBJECTID',
            type: 'esriFieldTypeOID',
            alias: 'OBJECTID',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'timestamp',
            type: 'esriFieldTypeDate',
            alias: 'timestamp',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 36,
          },
          {
            name: 'label',
            type: 'esriFieldTypeString',
            alias: 'label',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
          {
            name: 'category',
            type: 'esriFieldTypeString',
            alias: 'category',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
          {
            name: 'weight',
            type: 'esriFieldTypeString',
            alias: 'weight',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
        geomType: 'esriGeometryPoint',
        hasZ: false,
        hasM: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
