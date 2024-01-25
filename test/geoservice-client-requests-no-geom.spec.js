const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');
const request = require('supertest');
const CURRENT_VERSION = 11.2;
const COPYRIGHT_TEXT =
  'Copyright information varies by provider. For more information please contact the source of this data.';

const mockLogger = {
  debug: () => {},
  info: () => {},
  silly: () => {},
  warn: () => {},
  error: () => {},
};

const idUrlParam = 'no-geom-w-objectid';
const IDFIELD = 'OBJECTID';
const koop = new Koop({ logLevel: 'error', logger: mockLogger });
koop.register(provider, { dataDir: './test/provider-data' });

describe('Typical Geoservice Client request sequence: Dataset with no geometry', () => {
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
        const serverInfo = response.body;
        expect(serverInfo).toEqual({
          currentVersion: CURRENT_VERSION,
          maxRecordCount: 2000,
          serviceDescription: 'GeoJSON from no-geom-w-objectid.geojson',
          description: 'GeoJSON from no-geom-w-objectid.geojson',
          copyrightText: COPYRIGHT_TEXT,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
          layerOverridesEnabled: false,
          hasSharedDomains: false,
          fullExtent: {
            xmin: -180,
            ymin: -90,
            xmax: 180,
            ymax: 90,
            spatialReference: { wkid: 4326, latestWkid: 4326 },
          },
          initialExtent: {
            xmin: -180,
            ymin: -90,
            xmax: 180,
            ymax: 90,
            spatialReference: { wkid: 4326, latestWkid: 4326 },
          },
          hasStaticData: false,
          units: 'esriDecimalDegrees',
          tables: [
            {
              id: 0,
              name: 'no-geom-w-objectid.geojson',
              parentLayerId: -1,
              defaultVisibility: true,
              subLayerIds: null,
              type: 'Table',
              minScale: 0,
              maxScale: 0,
            },
          ],
          layers: [],
          supportedQueryFormats: 'JSON',
          capabilities: 'Query',
          syncEnabled: false,
          hasVersionedData: false,
          supportsDisconnectedEditing: false,
          supportsRelationshipsResource: false,
          allowGeometryUpdates: false,
          relationships: [],
          supportedContingentValuesFormats: '',
          supportedExportFormats: '',
          supportsAppend: false,
          supportsApplyEditsWithGlobalIds: false,
          supportsContingentValuesJson: null,
          supportsLayerOverrides: false,
          supportsQueryContingentValues: false,
          supportsReturnDeleteResults: false,
          supportsSharedDomains: false,
          supportsTemporalLayers: false,
          supportsTilesAndBasicQueriesMode: true,
          supportsVCSProjection: false,
          supportsWebHooks: false,
        });
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
        expect(info).toEqual({
          layers: [],
          tables: [
            {
              currentVersion: CURRENT_VERSION,
              id: 0,
              name: 'no-geom-w-objectid.geojson',
              type: 'Table',
              description: 'GeoJSON from no-geom-w-objectid.geojson',
              copyrightText: COPYRIGHT_TEXT,
              defaultVisibility: true,
              hasAttachments: false,
              htmlPopupType: 'esriServerHTMLPopupTypeNone',
              hasContingentValuesDefinition: false,
              displayField: 'OBJECTID',
              typeIdField: '',
              preferredTimeReference: null,
              maxRecordCountFactor: 1,
              standardMaxRecordCount: 2000,
              standardMaxRecordCountNoGeometry: 2000,
              supportedAppendFormats: '',
              supportedContingentValuesFormats: '',
              supportedExportFormats: '',
              supportedQueryFormats: 'JSON,geojson,PBF',
              supportedSpatialRelationships: [
                'esriSpatialRelIntersects',
                'esriSpatialRelContains',
                'esriSpatialRelEnvelopeIntersects',
                'esriSpatialRelWithin',
              ],
              supportsASyncCalculate: false,
              supportsAdvancedQueries: true,
              supportsAppend: false,
              supportsApplyEditsWithGlobalIds: false,
              supportsAttachmentsByUploadId: false,
              supportsAttachmentsResizing: false,
              supportsCalculate: false,
              supportsExceedsLimitStatistics: false,
              supportsFieldDescriptionProperty: false,
              supportsLayerOverrides: false,
              supportsQuantizationEditMode: false,
              supportsReturningQueryGeometry: false,
              supportsRollbackOnFailureParameter: false,
              supportsStatistics: true,
              supportsTilesAndBasicQueriesMode: true,
              supportsTruncate: false,
              supportsValidateSql: false,
              templates: [],
              tileMaxRecordCount: 2000,
              fields: [
                {
                  name: 'OBJECTID',
                  type: 'esriFieldTypeOID',
                  alias: 'OBJECTID',
                  sqlType: 'sqlTypeInteger',
                  domain: null,
                  defaultValue: null,
                  editable: false,
                  nullable: false,
                },
                {
                  name: 'timestamp',
                  type: 'esriFieldTypeDate',
                  alias: 'timestamp',
                  sqlType: 'sqlTypeOther',
                  domain: null,
                  defaultValue: null,
                  length: 36,
                  editable: false,
                  nullable: false,
                },
                {
                  name: 'label',
                  type: 'esriFieldTypeString',
                  alias: 'label',
                  sqlType: 'sqlTypeOther',
                  domain: null,
                  defaultValue: null,
                  length: 128,
                  editable: false,
                  nullable: false,
                },
                {
                  name: 'category',
                  type: 'esriFieldTypeString',
                  alias: 'category',
                  sqlType: 'sqlTypeOther',
                  domain: null,
                  defaultValue: null,
                  length: 128,
                  editable: false,
                  nullable: false,
                },
              ],
              relationships: [],
              capabilities: 'Query',
              maxRecordCount: 2000,
              ownershipBasedAccessControlForFeatures: {
                allowOthersToQuery: true,
              },
              useStandardizedQueries: true,
              advancedQueryCapabilities: {
                advancedEditingCapabilities: {},
                advancedQueryAnalyticCapabilities: {},
                supportedLodTypes: [],
                supportedOperationsWithCacheHint: [],
                supportedSpatialAggregationStatistics: [],
                supportsAdvancedQueryRelated: false,
                supportsCountDistinct: false,
                supportsCurrentUserQueries: false,
                supportsDefaultSR: false,
                supportsDisjointSpatialRel: false,
                supportsDistinct: true,
                supportsFullTextSearch: false,
                supportsHavingClause: false,
                supportsLod: false,
                supportsMaxRecordCountFactor: false,
                supportsOrderBy: true,
                supportsOutFieldSQLExpression: false,
                supportsPagination: true,
                supportsPaginationOnAggregatedQueries: false,
                supportsPercentileStatistics: false,
                supportsQueryAnalytic: false,
                supportsQueryAttachmentsCountOnly: false,
                supportsQueryRelatedPagination: false,
                supportsQueryWithCacheHint: false,
                supportsQueryWithDatumTransformation: false,
                supportsQueryWithDistance: false,
                supportsQueryWithLodSR: false,
                supportsQueryWithResultType: false,
                supportsReturningGeometryCentroid: false,
                supportsReturningGeometryEnvelope: false,
                supportsReturningQueryExtent: true,
                supportsSqlExpression: false,
                supportsStatistics: true,
                supportsTopFeaturesQuery: false,
              },
              dateFieldsTimeReference: {
                respectsDaylightSaving: false,
                timeZone: 'UTC',
              },
              isDataVersioned: false,
              hasM: false,
              hasZ: false,
              allowGeometryUpdates: false,
              objectIdField: 'OBJECTID',
              globalIdField: '',
              types: [],
              hasStaticData: false,
              timeInfo: {},
              uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
            },
          ],
        });
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
        expect(info).toEqual({
          currentVersion: CURRENT_VERSION,
          id: 0,
          name: 'no-geom-w-objectid.geojson',
          type: 'Table',
          description: 'GeoJSON from no-geom-w-objectid.geojson',
          copyrightText: COPYRIGHT_TEXT,
          defaultVisibility: true,
          hasAttachments: false,
          preferredTimeReference: null,
          hasContingentValuesDefinition: false,
          maxRecordCountFactor: 1,
          htmlPopupType: 'esriServerHTMLPopupTypeNone',
          displayField: 'OBJECTID',
          typeIdField: '',
          standardMaxRecordCount: 2000,
          standardMaxRecordCountNoGeometry: 2000,
          supportedAppendFormats: '',
          supportedContingentValuesFormats: '',
          supportedExportFormats: '',
          supportedQueryFormats: 'JSON,geojson,PBF',
          supportedSpatialRelationships: [
            'esriSpatialRelIntersects',
            'esriSpatialRelContains',
            'esriSpatialRelEnvelopeIntersects',
            'esriSpatialRelWithin',
          ],
          supportsASyncCalculate: false,
          supportsAdvancedQueries: true,
          supportsAppend: false,
          supportsApplyEditsWithGlobalIds: false,
          supportsAttachmentsByUploadId: false,
          supportsAttachmentsResizing: false,
          supportsCalculate: false,
          supportsExceedsLimitStatistics: false,
          supportsFieldDescriptionProperty: false,
          supportsLayerOverrides: false,
          supportsQuantizationEditMode: false,
          supportsReturningQueryGeometry: false,
          supportsRollbackOnFailureParameter: false,
          supportsStatistics: true,
          supportsTilesAndBasicQueriesMode: true,
          supportsTruncate: false,
          supportsValidateSql: false,
          templates: [],
          tileMaxRecordCount: 2000,
          fields: [
            {
              name: 'OBJECTID',
              type: 'esriFieldTypeOID',
              alias: 'OBJECTID',
              sqlType: 'sqlTypeInteger',
              domain: null,
              defaultValue: null,
              editable: false,
              nullable: false,
            },
            {
              name: 'timestamp',
              type: 'esriFieldTypeDate',
              alias: 'timestamp',
              sqlType: 'sqlTypeOther',
              domain: null,
              defaultValue: null,
              length: 36,
              editable: false,
              nullable: false,
            },
            {
              name: 'label',
              type: 'esriFieldTypeString',
              alias: 'label',
              sqlType: 'sqlTypeOther',
              domain: null,
              defaultValue: null,
              length: 128,
              editable: false,
              nullable: false,
            },
            {
              name: 'category',
              type: 'esriFieldTypeString',
              alias: 'category',
              sqlType: 'sqlTypeOther',
              domain: null,
              defaultValue: null,
              length: 128,
              editable: false,
              nullable: false,
            },
          ],
          relationships: [],
          capabilities: 'Query',
          maxRecordCount: 2000,
          ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
          useStandardizedQueries: true,
          advancedQueryCapabilities: {
            supportsStatistics: true,
            supportsOrderBy: true,
            supportsDistinct: true,
            supportsPagination: true,
            supportsReturningQueryExtent: true,
            supportsQueryWithDistance: false,
            advancedEditingCapabilities: {},
            advancedQueryAnalyticCapabilities: {},
            supportedLodTypes: [],
            supportedOperationsWithCacheHint: [],
            supportedSpatialAggregationStatistics: [],
            supportsAdvancedQueryRelated: false,
            supportsCountDistinct: false,
            supportsCurrentUserQueries: false,
            supportsDefaultSR: false,
            supportsDisjointSpatialRel: false,
            supportsFullTextSearch: false,
            supportsHavingClause: false,
            supportsLod: false,
            supportsMaxRecordCountFactor: false,
            supportsOutFieldSQLExpression: false,
            supportsPaginationOnAggregatedQueries: false,
            supportsPercentileStatistics: false,
            supportsQueryAnalytic: false,
            supportsQueryAttachmentsCountOnly: false,
            supportsQueryRelatedPagination: false,
            supportsQueryWithCacheHint: false,
            supportsQueryWithDatumTransformation: false,
            supportsQueryWithLodSR: false,
            supportsQueryWithResultType: false,
            supportsReturningGeometryCentroid: false,
            supportsReturningGeometryEnvelope: false,
            supportsSqlExpression: false,
            supportsTopFeaturesQuery: false,
          },
          dateFieldsTimeReference: {
            respectsDaylightSaving: false,
            timeZone: 'UTC',
          },
          isDataVersioned: false,
          hasM: false,
          hasZ: false,
          allowGeometryUpdates: false,
          objectIdField: 'OBJECTID',
          globalIdField: '',
          types: [],
          hasStaticData: false,
          timeInfo: {},
          uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        });
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
      expect(results).toEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 102100, latestWkid: 3857 },
        fields: [
          {
            name: 'OBJECTID',
            type: 'esriFieldTypeOID',
            alias: 'OBJECTID',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
        ],
        features: [
          { attributes: { OBJECTID: 1 }, geometry: null },
          { attributes: { OBJECTID: 2 }, geometry: null },
          { attributes: { OBJECTID: 3 }, geometry: null },
        ],
        exceededTransferLimit: false,
      });
    });
  });

  describe('On "identify" operation', () => {
    test('filter by objectIds, return all outFields (wildcard)', async () => {
      const identifyResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&objectIds=${objectIds[0]}&outFields=*&outSR=102100&spatialRel=esriSpatialRelIntersects&where=1%3D1`,
      );

      expect(identifyResponse.body).toEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 102100, latestWkid: 3857 },
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
        ],
        features: [
          {
            attributes: {
              OBJECTID: 1,
              timestamp: 1681143330000,
              label: 'White Leg',
              category: 'pinto',
            },
            geometry: null,
          },
        ],
        exceededTransferLimit: false,
      });
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

      expect(identifyResponse.body).toEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 102100, latestWkid: 3857 },
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
        ],
        features: [
          {
            attributes: {
              OBJECTID: 1,
              timestamp: 1681143330000,
              label: 'White Leg',
              category: 'pinto',
            },
            geometry: null,
          },
        ],
        exceededTransferLimit: false,
      });
    });
  });

  describe('On "map-filter" operation', () => {
    test('outStatitics', async () => {
      const statisticsResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&groupByFieldsForStatistics=category&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22category%22%2C%22outStatisticFieldName%22%3A%22countOFcategory%22%2C%22statisticType%22%3A%22count%22%7D%5D&spatialRel=esriSpatialRelIntersects&where=1%3D1`,
      );

      expect(statisticsResponse.body).toEqual({
        displayFieldName: '',
        fields: [
          {
            name: 'countOFcategory',
            type: 'esriFieldTypeDouble',
            sqlType: 'sqlTypeFloat',
            alias: 'countOFcategory',
            domain: null,
            defaultValue: null,
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
        ],
        features: [
          { attributes: { countOFcategory: 2, category: 'pinto' } },
          { attributes: { countOFcategory: 1, category: 'draft' } },
        ],
      });
    });

    test('get features by page, outFields only the filtered attribute ', async () => {
      const featuresResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&resultOffset=2&resultRecordCount=1&where=1%3D1&orderByFields=${IDFIELD}&outFields=category&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects`,
      );

      expect(featuresResponse.body).toEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 102100, latestWkid: 3857 },
        fields: [
          {
            name: 'category',
            type: 'esriFieldTypeString',
            alias: 'category',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
        features: [{ attributes: { category: 'draft' } }],
        exceededTransferLimit: false,
      });
    });

    test('reload map after filter application', async () => {
      const featuresResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&resultOffset=0&resultRecordCount=2000&where=category%20%3D%20%27pinto%27&orderByFields=${IDFIELD}&outFields=category%2C${IDFIELD}&outSR=102100&spatialRel=esriSpatialRelIntersects`,
      );

      expect(featuresResponse.body).toEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 102100, latestWkid: 3857 },
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
            name: 'category',
            type: 'esriFieldTypeString',
            alias: 'category',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
        features: [
          { attributes: { category: 'pinto', OBJECTID: 1 }, geometry: null },
          { attributes: { category: 'pinto', OBJECTID: 2 }, geometry: null },
        ],
        exceededTransferLimit: false,
      });
    });
  });

  describe('On open attribute table', () => {
    test('get first 50 features without geometry', async () => {
      const featuresResponse = await request(koop.server).get(
        `/file-geojson/rest/services/${idUrlParam}/FeatureServer/0/query?f=json&&resultOffset=0&resultRecordCount=50&where=1%3D1&orderByFields=&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects`,
      );

      expect(featuresResponse.body).toEqual({
        objectIdFieldName: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdFieldName: '',
        hasZ: false,
        hasM: false,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
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
        ],
        features: [
          {
            attributes: {
              OBJECTID: 1,
              timestamp: 1681143330000,
              label: 'White Leg',
              category: 'pinto',
            },
          },
          {
            attributes: {
              OBJECTID: 2,
              timestamp: 1586708130000,
              label: 'Fireman',
              category: 'pinto',
            },
          },
          {
            attributes: {
              OBJECTID: 3,
              timestamp: 1428768930000,
              label: 'Workhorse',
              category: 'draft',
            },
          },
        ],
        exceededTransferLimit: false,
      });
    });
  });
});
