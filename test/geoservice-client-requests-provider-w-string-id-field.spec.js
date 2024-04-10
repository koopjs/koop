const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const {
  getServerInfo,
  getLayersInfo,
  getLayerInfo,
  getFirst2000,
  filterByObjectIds,
  getOutStatistics,
  paginated,
  getWithFilter,
  getAttributeTable,
} = require('./helpers/client-response-fixtures');
const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {},
};

const idUrlParam = 'points-w-metadata-id';
const IDFIELD = 'id';
const koop = new Koop({ logLevel: 'error', logger: mockLogger });
koop.register(provider, { dataDir: './test/provider-data' });

describe('Typical Geoservice Client request sequence: Dataset with defined idField point at string property', () => {
  let objectIds;

  beforeAll(async () => {
    const response = await request(koop.server).get(
      `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?returnIdsOnly=true`,
    );
    objectIds = response.body.objectIds;
  });

  describe('Service inquiry', () => {
    test('get server info', async () => {
      try {
        const response = await request(koop.server).get(
          `/file-geojson/rest/services/${idUrlParam}/FeatureServer`,
        );
        expect(response.status).toBe(200);
        const serverInfo = response.body;
        expect(serverInfo).toEqual(getServerInfo(idUrlParam));
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    test('get layers info', async () => {
      try {
        const response = await request(koop.server).get(
          `/file-geojson/rest/services/${idUrlParam}/FeatureServer/layers`,
        );
        expect(response.status).toBe(200);
        const info = response.body;
        expect(info).toEqual(getLayersInfo(idUrlParam, IDFIELD));
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });

  describe('On adding layer to map', () => {
    test('get layer info', async () => {
      try {
        const response = await request(koop.server).get(
          `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0`,
        );
        expect(response.status).toBe(200);
        const info = response.body;
        expect(info).toEqual(getLayerInfo(idUrlParam, IDFIELD));
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    test('returnIdsOnly, returnCountOnly', async () => {
      const response = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&returnIdsOnly=true&returnCountOnly=true&spatialRel=esriSpatialRelIntersects&where=1%3D1`,
      );
      expect(response.status).toBe(200);
      const results = response.body;
      expect(results).toEqual({ count: 3 });
    });

    test('get first 2000, only OBJECTIDs, orderBy OBJECTID, convert outSR', async () => {
      const response = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&resultOffset=0&resultRecordCount=2000&where=1%3D1&orderByFields=${IDFIELD}&outFields=${IDFIELD}&outSR=102100&spatialRel=esriSpatialRelIntersects`,
      );
      expect(response.status).toBe(200);
      const results = response.body;
      expect(results).toEqual(getFirst2000(IDFIELD, objectIds));
    });
  });

  describe('On "identify" operation', () => {
    test('filter by objectIds, return all outFields (wildcard)', async () => {
      const identifyResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&objectIds=${objectIds[0]}&outFields=*&outSR=102100&spatialRel=esriSpatialRelIntersects&where=1%3D1`,
      );

      expect(identifyResponse.body).toEqual(
        filterByObjectIds(IDFIELD, objectIds),
      );
    });

    test('filter by objectIds, return all outFields defined by layer info', async () => {
      const layerInfoResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0`,
      );

      const fields = layerInfoResponse.body.fields.map((field) => field.name);

      const identifyResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&objectIds=${
          objectIds[0]
        }&outFields=${fields.join(
          ',',
        )}&outSR=102100&spatialRel=esriSpatialRelIntersects&where=1%3D1`,
      );

      expect(identifyResponse.body).toEqual(
        filterByObjectIds(IDFIELD, objectIds),
      );
    });
  });

  describe('On "map-filter" operation', () => {
    test('outStatitics', async () => {
      const statisticsResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&groupByFieldsForStatistics=category&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22category%22%2C%22outStatisticFieldName%22%3A%22countOFcategory%22%2C%22statisticType%22%3A%22count%22%7D%5D&spatialRel=esriSpatialRelIntersects&where=1%3D1`,
      );

      expect(statisticsResponse.body).toEqual(getOutStatistics());
    });

    test('get features by page, outFields only the filtered attribute ', async () => {
      const featuresResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&resultOffset=2&resultRecordCount=1&where=1%3D1&orderByFields=${IDFIELD}&outFields=category&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects`,
      );

      expect(featuresResponse.body).toEqual(paginated(IDFIELD));
    });

    test('reload map after filter application', async () => {
      const featuresResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&resultOffset=0&resultRecordCount=2000&where=category%20%3D%20%27pinto%27&orderByFields=${IDFIELD}&outFields=category%2C${IDFIELD}&outSR=102100&spatialRel=esriSpatialRelIntersects`,
      );

      expect(featuresResponse.body).toEqual(getWithFilter(IDFIELD, objectIds));
    });
  });

  describe('On open attribute table', () => {
    test('get first 50 features without geometry', async () => {
      const featuresResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&&resultOffset=0&resultRecordCount=50&where=1%3D1&orderByFields=&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects`,
      );

      expect(featuresResponse.body).toEqual(
        getAttributeTable(IDFIELD, objectIds),
      );
    });
  });
});
