const should = require('should');
should.config.checkProtoEql = false;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const CURRENT_VERSION = 11.2;

const createLayerMetadataFieldsSpy = sinon.spy(function () {
  return ['fields'];
});
const fields = {
  LayerFields: {
    create: createLayerMetadataFieldsSpy,
  },
};

const loggerSpy = {
  error: sinon.spy(),
};

const TableLayerMetadata = proxyquire('./table-layer-metadata', {
  '../helpers/fields': fields,
  '../log-manager': { logger: loggerSpy },
});

describe('TableLayerMetadata', () => {
  beforeEach(() => {
    createLayerMetadataFieldsSpy.resetHistory();
  });

  describe('static create', () => {
    it('should return default metadata', () => {
      const tableLayerMetadata = TableLayerMetadata.create({});
      tableLayerMetadata.should.deepEqual({
        currentVersion: CURRENT_VERSION,
        supportedPbfFeatureEncodings: 'esriDefault',
        id: 0,
        name: 'Not Set',
        type: 'Table',
        displayField: 'OBJECTID',
        description:
          'This is a feature layer exposed with Koop. For more information go to https://github.com/koopjs/koop.', // eslint-disable-line
        copyrightText:
          'Copyright information varies by provider. For more information please contact the source of this data.', // eslint-disable-line
        defaultVisibility: true,
        isDataVersioned: false,
        hasContingentValuesDefinition: false,
        supportsAppend: false,
        supportsCalculate: false,
        supportsASyncCalculate: false,
        supportsTruncate: false,
        supportsAttachmentsByUploadId: false,
        supportsAttachmentsResizing: false,
        supportsRollbackOnFailureParameter: false,
        supportsStatistics: true,
        supportsExceedsLimitStatistics: false,
        supportsAdvancedQueries: true,
        supportsValidateSql: false,
        supportsLayerOverrides: false,
        supportsTilesAndBasicQueriesMode: true,
        supportsFieldDescriptionProperty: false,
        supportsQuantizationEditMode: false,
        supportsApplyEditsWithGlobalIds: false,
        supportsReturningQueryGeometry: false,
        advancedQueryCapabilities: {
          supportsPagination: true,
          supportsQueryAttachmentsCountOnly: false,
          supportsPaginationOnAggregatedQueries: false,
          supportsQueryRelatedPagination: false,
          supportsQueryWithDistance: false,
          supportsReturningQueryExtent: true,
          supportsStatistics: true,
          supportsOrderBy: true,
          supportsDistinct: true,
          supportsQueryWithResultType: false,
          supportsSqlExpression: false,
          supportsAdvancedQueryRelated: false,
          supportsCountDistinct: false,
          supportsPercentileStatistics: false,
          supportedSpatialAggregationStatistics: [],
          supportsLod: false,
          supportsQueryWithLodSR: false,
          supportedLodTypes: [],
          supportsReturningGeometryCentroid: false,
          supportsReturningGeometryEnvelope: false,
          supportsQueryWithDatumTransformation: false,
          supportsCurrentUserQueries: false,
          supportsHavingClause: false,
          supportsOutFieldSQLExpression: false,
          supportsMaxRecordCountFactor: false,
          supportsTopFeaturesQuery: false,
          supportsDisjointSpatialRel: false,
          supportsQueryWithCacheHint: false,
          supportedOperationsWithCacheHint: [],
          supportsQueryAnalytic: false,
          supportsDefaultSR: false,
          supportsFullTextSearch: false,
          advancedQueryAnalyticCapabilities: {},
          advancedEditingCapabilities: {},
        },
        useStandardizedQueries: true,
        allowGeometryUpdates: false,
        hasAttachments: false,
        htmlPopupType: 'esriServerHTMLPopupTypeNone',
        hasM: false,
        hasZ: false,
        objectIdField: 'OBJECTID',
        uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
        globalIdField: '',
        typeIdField: '',
        dateFieldsTimeReference: {
          timeZone: 'UTC',
          respectsDaylightSaving: false,
        },
        preferredTimeReference: null,
        templates: [],
        supportedQueryFormats: 'JSON,geojson,PBF',
        supportedAppendFormats: '',
        supportedExportFormats: '',
        supportedSpatialRelationships: [
          'esriSpatialRelIntersects',
          'esriSpatialRelContains',
          'esriSpatialRelEnvelopeIntersects',
          'esriSpatialRelWithin',
        ],
        supportedContingentValuesFormats: '',
        hasStaticData: false,
        maxRecordCount: 2000,
        standardMaxRecordCount: 2000,
        standardMaxRecordCountNoGeometry: 2000,
        tileMaxRecordCount: 2000,
        maxRecordCountFactor: 1,
        fields: ['fields'],
        relationships: [],
        capabilities: 'Query',
        ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
        types: [],
        timeInfo: {},
      });
    });

    it('uses layerId from  options params', () => {
      const result = TableLayerMetadata.create({}, { params: { layer: 99 } });
      result.id.should.equal(99);
    });

    it('uses hasStaticData from geojson metadata', () => {
      const result = TableLayerMetadata.create({ metadata: { hasStaticData: true } }, {});
      result.hasStaticData.should.equal(true);
    });

    it('uses supportsPagination from geojson metadata', () => {
      const result = TableLayerMetadata.create({ metadata: { supportsPagination: true } }, {});
      result.advancedQueryCapabilities.supportsPagination.should.equal(true);
    });

    it('uses hasAttachments from geojson metadata', () => {
      const result = TableLayerMetadata.create({ metadata: { hasAttachments: true } }, {});
      result.hasAttachments.should.equal(true);
    });

    it('add "Extract" to default "capabilities" if capabilities.extract is truthy', () => {
      const result = TableLayerMetadata.create({ capabilities: { extract: true } });
      result.capabilities.should.equal('Query, Extract');
    });

    it('uses valid string override for supportedQueryFormats', () => {
      const tableLayerMetadata = TableLayerMetadata.create({
        metadata: { supportedQueryFormats: 'JSON' },
      });
      tableLayerMetadata.supportedQueryFormats.should.equal('JSON');
    });

    it('uses valid array to override for supportedQueryFormats', () => {
      const tableLayerMetadata = TableLayerMetadata.create({
        metadata: { supportedQueryFormats: ['JSON'] },
      });
      tableLayerMetadata.supportedQueryFormats.should.equal('JSON');
    });

    it('uses default if invalid value passed for supportedQueryFormats', () => {
      const tableLayerMetadata = TableLayerMetadata.create({
        metadata: { supportedQueryFormats: ['JSOz'] },
      });
      tableLayerMetadata.supportedQueryFormats.should.equal('JSON,geojson,PBF');
    });

    it('static method "create" should handle missing options', () => {
      try {
        const tableLayerMetadata = TableLayerMetadata.create({
          features: ['feature'],
        });
        tableLayerMetadata.should.be.an.Object();
      } catch (err) {
        throw new Error(`should not throw; ${err.message}`);
      }
    });
  });
});
