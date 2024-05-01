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

describe('Feature Server Output - /generateRenderer', () => {
  const koop = new Koop({ logLevel: 'debug', logger: mockLogger });
  koop.register(provider, { dataDir: './test/provider-data' });

  test('return empty result when no classification def is sent', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/points-w-number-attr/FeatureServer/0/generateRenderer',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test('return empty result when no classification def is sent', async () => {
    try {
      const response = await request(koop.server).get(
        '/file-geojson/rest/services/points-w-number-attr/FeatureServer/0/generateRenderer?classificationDef=%7B%0D%0A++"type"%3A+"classBreaksDef"%2C%0D%0A++"classificationField"%3A+"weight"%2C%0D%0A++"classificationMethod"%3A+"esriClassifyNaturalBreaks"%2C%0D%0A++"breakCount"%3A+5%0D%0A%7D', // eslint-disable-line
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        type: 'classBreaks',
        field: 'weight',
        classificationMethod: 'esriClassifyNaturalBreaks',
        minValue: 900,
        classBreakInfos: [
          {
            classMinValue: 900,
            classMaxValue: 900,
            label: '900-900',
            description: '',
            symbol: {
              color: [0, 255, 0],
              outline: {
                color: [190, 190, 190, 105],
                width: 0.5,
                type: 'esriSLS',
                style: 'esriSLSSolid',
              },
              size: 7.5,
              type: 'esriSMS',
              style: 'esriSMSCircle',
            },
          },
          {
            classMinValue: 901,
            classMaxValue: 1103,
            label: '901-1103',
            description: '',
            symbol: {
              color: [0, 255, 255],
              outline: {
                color: [190, 190, 190, 105],
                width: 0.5,
                type: 'esriSLS',
                style: 'esriSLSSolid',
              },
              size: 7.5,
              type: 'esriSMS',
              style: 'esriSMSCircle',
            },
          },
          {
            classMinValue: 1104,
            label: '1104-undefined',
            description: '',
            symbol: {
              color: [0, 0, 255],
              outline: {
                color: [190, 190, 190, 105],
                width: 0.5,
                type: 'esriSLS',
                style: 'esriSLSSolid',
              },
              size: 7.5,
              type: 'esriSMS',
              style: 'esriSMSCircle',
            },
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
