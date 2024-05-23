const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const { CURRENT_VERSION } = require('./helpers/client-response-fixtures');
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

  describe('Feature Server - server metadata', () => {
    test('server info generated from geojson features', async () => {
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/points-w-objectid/FeatureServer',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          currentVersion: CURRENT_VERSION,
          serviceDescription: 'GeoJSON from points-w-objectid.geojson',
          hasVersionedData: false,
          supportsDisconnectedEditing: false,
          hasStaticData: false,
          hasSharedDomains: false,
          maxRecordCount: 2000,
          supportedQueryFormats: 'JSON',
          supportsVCSProjection: false,
          supportedExportFormats: '',
          capabilities: 'Query',
          description: 'GeoJSON from points-w-objectid.geojson',
          copyrightText:
            'Copyright information varies by provider. For more information please contact the source of this data.', // eslint-disable-line
          spatialReference: { wkid: 4326, latestWkid: 4326 },
          fullExtent: {
            spatialReference: { wkid: 4326, latestWkid: 4326 },
            xmin: -120,
            xmax: -80,
            ymin: 25,
            ymax: 45,
          },
          initialExtent: {
            spatialReference: { wkid: 4326, latestWkid: 4326 },
            xmin: -120,
            xmax: -80,
            ymin: 25,
            ymax: 45,
          },
          allowGeometryUpdates: false,
          units: 'esriDecimalDegrees',
          supportsAppend: false,
          supportsSharedDomains: false,
          supportsWebHooks: false,
          supportsTemporalLayers: false,
          layerOverridesEnabled: false,
          syncEnabled: false,
          supportsApplyEditsWithGlobalIds: false,
          supportsReturnDeleteResults: false,
          supportsLayerOverrides: false,
          supportsTilesAndBasicQueriesMode: true,
          supportsQueryContingentValues: false,
          supportedContingentValuesFormats: '',
          supportsContingentValuesJson: null,
          tables: [],
          layers: [
            {
              id: 0,
              name: 'points-w-objectid.geojson',
              type: 'Feature Layer',
              parentLayerId: -1,
              defaultVisibility: true,
              subLayerIds: null,
              minScale: 0,
              maxScale: 0,
              geometryType: 'esriGeometryPoint',
            },
          ],
          relationships: [],
          supportsRelationshipsResource: false,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    test('server info generated from geojson metadata', async () => {
      try {
        const response = await request(koop.server).get(
          '/file-geojson/rest/services/points-w-server-metadata/FeatureServer',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          currentVersion: CURRENT_VERSION,
          serviceDescription: 'test',
          hasVersionedData: false,
          supportsDisconnectedEditing: false,
          hasStaticData: true,
          hasSharedDomains: false,
          maxRecordCount: 100,
          supportedQueryFormats: 'JSON',
          supportsVCSProjection: false,
          supportedExportFormats: '',
          capabilities: 'Query',
          description: 'test',
          copyrightText:
            'Copyright information varies by provider. For more information please contact the source of this data.', // eslint-disable-line
          spatialReference: { wkid: 4326, latestWkid: 4326 },
          fullExtent: {
            spatialReference: { wkid: 4326, latestWkid: 4326 },
            xmin: 11,
            xmax: 13,
            ymin: 12,
            ymax: 14,
          },
          initialExtent: {
            spatialReference: { wkid: 4326, latestWkid: 4326 },
            xmin: 11,
            xmax: 13,
            ymin: 12,
            ymax: 14,
          },
          allowGeometryUpdates: false,
          units: 'esriDecimalDegrees',
          supportsAppend: false,
          supportsSharedDomains: false,
          supportsWebHooks: false,
          supportsTemporalLayers: false,
          layerOverridesEnabled: false,
          syncEnabled: false,
          supportsApplyEditsWithGlobalIds: false,
          supportsReturnDeleteResults: false,
          supportsLayerOverrides: false,
          supportsTilesAndBasicQueriesMode: true,
          supportsQueryContingentValues: false,
          supportedContingentValuesFormats: '',
          supportsContingentValuesJson: null,
          tables: [],
          layers: [
            {
              id: 0,
              name: 'points-w-server-metadata.geojson',
              type: 'Feature Layer',
              parentLayerId: -1,
              defaultVisibility: true,
              subLayerIds: null,
              minScale: 0,
              maxScale: 0,
              geometryType: 'esriGeometryPoint',
            },
          ],
          relationships: [],
          supportsRelationshipsResource: false,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});
