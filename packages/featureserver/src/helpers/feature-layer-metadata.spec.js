const should = require('should');
should.config.checkProtoEql = false;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const CURRENT_VERSION = 11.2;

const envelopeSpy = sinon.spy(function () {
  return { bbox: [-180, -90, 180, 90] };
});
const getSpatialReferenceSpy = sinon.spy(function () {
  return {
    wkid: 4326,
    latestWkid: 4326,
  };
});
const getGeometryTypeFromGeojsonSpy = sinon.spy(function (options) {
  return options.geometryType || 'esriGeometryPoint';
});
const normalizeExtentSpy = sinon.spy(function () {
  return 'normalized-extent';
});

const FeatureLayerMetadata = proxyquire('./feature-layer-metadata', {
  '@turf/envelope': envelopeSpy,
  './get-spatial-reference': getSpatialReferenceSpy,
  './get-geometry-type-from-geojson': getGeometryTypeFromGeojsonSpy,
  './normalize-extent': normalizeExtentSpy,
});

describe('FeatureLayerMetadata', () => {
  beforeEach(() => {
    envelopeSpy.resetHistory();
    getSpatialReferenceSpy.resetHistory();
    getGeometryTypeFromGeojsonSpy.resetHistory();
    normalizeExtentSpy.resetHistory();
  });

  it('calling with new should return default metadata', () => {
    const featureLayerMetadata = new FeatureLayerMetadata();

    featureLayerMetadata.should.deepEqual({
      currentVersion: CURRENT_VERSION,
      supportedPbfFeatureEncodings: 'esriDefault',
      id: 0,
      name: 'Not Set',
      type: 'Feature Layer',
      displayField: '',
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
      fields: [],
      relationships: [],
      capabilities: 'Query',
      ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
      types: [],
      timeInfo: {},
      minScale: 0,
      maxScale: 0,
      drawingInfo: { renderer: {}, labelingInfo: null },
      extent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      supportsCoordinatesQuantization: true,
      hasLabels: false,
    });
  });

  describe('mixinOverrides', () => {
    it('should function without options', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      const result = featureLayerMetadata.mixinOverrides({
        features: [],
      });

      result.should.be.an.Object();
    });

    it('should set point geometryType and renderer', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();
      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        { foo: 'bar' },
      );

      featureLayerMetadata.drawingInfo.renderer.should.deepEqual({
        type: 'simple',
        symbol: {
          color: [247, 150, 70, 161],
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
      });
      featureLayerMetadata.geometryType.should.equal('esriGeometryPoint');
      getGeometryTypeFromGeojsonSpy.callCount.should.equal(1);
      getGeometryTypeFromGeojsonSpy.firstCall.args.should.deepEqual([
        {
          features: [],
          foo: 'bar',
        },
      ]);
    });

    it('should set line geometryType and renderer', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();
      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        { foo: 'bar', geometryType: 'esriGeometryPolyline' },
      );

      featureLayerMetadata.drawingInfo.renderer.should.deepEqual({
        type: 'simple',
        symbol: {
          color: [247, 150, 70, 204],
          width: 6.999999999999999,
          type: 'esriSLS',
          style: 'esriSLSSolid',
        },
      });
      featureLayerMetadata.geometryType.should.equal('esriGeometryPolyline');
      getGeometryTypeFromGeojsonSpy.callCount.should.equal(1);
      getGeometryTypeFromGeojsonSpy.firstCall.args.should.deepEqual([
        {
          features: [],
          foo: 'bar',
          geometryType: 'esriGeometryPolyline',
        },
      ]);
    });

    it('should set polygon geometryType and renderer', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();
      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        { foo: 'bar', geometryType: 'esriGeometryPolygon' },
      );

      featureLayerMetadata.drawingInfo.renderer.should.deepEqual({
        type: 'simple',
        symbol: {
          color: [75, 172, 198, 161],
          outline: {
            color: [150, 150, 150, 155],
            width: 0.5,
            type: 'esriSLS',
            style: 'esriSLSSolid',
          },
          type: 'esriSFS',
          style: 'esriSFSSolid',
        },
      });
      featureLayerMetadata.geometryType.should.equal('esriGeometryPolygon');
      getGeometryTypeFromGeojsonSpy.callCount.should.equal(1);
      getGeometryTypeFromGeojsonSpy.firstCall.args.should.deepEqual([
        {
          features: [],
          foo: 'bar',
          geometryType: 'esriGeometryPolygon',
        },
      ]);
    });

    it('should set quanitization if capabilities.quantization === true', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        {
          capabilities: {
            quantization: true,
          },
        },
      );
      featureLayerMetadata.should.deepEqual({
        currentVersion: CURRENT_VERSION,
        supportedPbfFeatureEncodings: 'esriDefault',
        id: 0,
        name: 'Not Set',
        type: 'Feature Layer',
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
        ],
        relationships: [],
        capabilities: 'Query',
        ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
        types: [],
        timeInfo: {},
        minScale: 0,
        maxScale: 0,
        drawingInfo: {
          renderer: {
            type: 'simple',
            symbol: {
              color: [247, 150, 70, 161],
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
          labelingInfo: null,
        },
        extent: {
          xmin: -180,
          ymin: -90,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        supportsCoordinatesQuantization: true,
        hasLabels: false,
        geometryType: 'esriGeometryPoint',
      });
    });

    it('should set extent from options', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      featureLayerMetadata.mixinOverrides(
        {
          features: ['feature'],
        },
        {
          extent: 'dataset-extent',
        },
      );

      featureLayerMetadata.should.deepEqual({
        currentVersion: CURRENT_VERSION,
        supportedPbfFeatureEncodings: 'esriDefault',
        id: 0,
        name: 'Not Set',
        type: 'Feature Layer',
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
        ],
        relationships: [],
        capabilities: 'Query',
        ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
        types: [],
        timeInfo: {},
        minScale: 0,
        maxScale: 0,
        drawingInfo: {
          renderer: {
            type: 'simple',
            symbol: {
              color: [247, 150, 70, 161],
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
          labelingInfo: null,
        },
        extent: 'normalized-extent',
        supportsCoordinatesQuantization: false,
        hasLabels: false,
        geometryType: 'esriGeometryPoint',
      });

      getSpatialReferenceSpy.callCount.should.equal(1);
      envelopeSpy.callCount.should.equal(0);
      normalizeExtentSpy.callCount.should.equal(1);
    });

    it('should set extent from features', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      featureLayerMetadata.mixinOverrides(
        {
          features: ['feature'],
        },
        {},
      );

      featureLayerMetadata.should.deepEqual({
        currentVersion: CURRENT_VERSION,
        supportedPbfFeatureEncodings: 'esriDefault',
        id: 0,
        name: 'Not Set',
        type: 'Feature Layer',
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
        ],
        relationships: [],
        capabilities: 'Query',
        ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
        types: [],
        timeInfo: {},
        minScale: 0,
        maxScale: 0,
        drawingInfo: {
          renderer: {
            type: 'simple',
            symbol: {
              color: [247, 150, 70, 161],
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
          labelingInfo: null,
        },
        extent: {
          xmin: -180,
          ymin: -90,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        supportsCoordinatesQuantization: false,
        hasLabels: false,
        geometryType: 'esriGeometryPoint',
      });

      getSpatialReferenceSpy.callCount.should.equal(1);
      envelopeSpy.callCount.should.equal(1);
      normalizeExtentSpy.callCount.should.equal(0);
    });

    it('should set renderer from options', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        { renderer: 'custom-renderer' },
      );

      featureLayerMetadata.should.deepEqual({
        currentVersion: CURRENT_VERSION,
        supportedPbfFeatureEncodings: 'esriDefault',
        id: 0,
        name: 'Not Set',
        type: 'Feature Layer',
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
        ],
        relationships: [],
        capabilities: 'Query',
        ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
        types: [],
        timeInfo: {},
        minScale: 0,
        maxScale: 0,
        drawingInfo: { renderer: 'custom-renderer', labelingInfo: null },
        extent: {
          xmin: -180,
          ymin: -90,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        supportsCoordinatesQuantization: false,
        hasLabels: false,
        geometryType: 'esriGeometryPoint',
      });
    });

    it('should set labelingInfo from options', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        { labelingInfo: 'label-info' },
      );

      featureLayerMetadata.drawingInfo.labelingInfo.should.equal('label-info');
    });

    it('should set other direct overrides', () => {
      const featureLayerMetadata = new FeatureLayerMetadata();

      featureLayerMetadata.mixinOverrides(
        {
          features: [],
        },
        { minScale: 1, maxScale: 10 },
      );

      featureLayerMetadata.should.deepEqual({
        currentVersion: CURRENT_VERSION,
        supportedPbfFeatureEncodings: 'esriDefault',
        id: 0,
        name: 'Not Set',
        type: 'Feature Layer',
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
        ],
        relationships: [],
        capabilities: 'Query',
        ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
        types: [],
        timeInfo: {},
        minScale: 1,
        maxScale: 10,
        drawingInfo: {
          renderer: {
            type: 'simple',
            symbol: {
              color: [247, 150, 70, 161],
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
          labelingInfo: null,
        },
        extent: {
          xmin: -180,
          ymin: -90,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        supportsCoordinatesQuantization: false,
        hasLabels: false,
        geometryType: 'esriGeometryPoint',
      });
    });
  });

  it('static method "create" should normalize input, call constructor, and mixin-overrides', () => {
    const featureLayerMetadata = FeatureLayerMetadata.create(
      {
        features: [],
        metadata: {
          foo: 'bar',
          displayField: 'myField',
          capabilities: 'list,of,stuff',
        },
        capabilities: {
          world: 'hellow',
        },
      },
      {
        params: { layer: '99' },
      },
    );

    featureLayerMetadata.should.deepEqual({
      currentVersion: CURRENT_VERSION,
      supportedPbfFeatureEncodings: 'esriDefault',
      id: 99,
      name: 'Not Set',
      type: 'Feature Layer',
      displayField: 'myField',
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
      ],
      relationships: [],
      capabilities: 'list,of,stuff',
      ownershipBasedAccessControlForFeatures: { allowOthersToQuery: true },
      types: [],
      timeInfo: {},
      minScale: 0,
      maxScale: 0,
      drawingInfo: {
        renderer: {
          type: 'simple',
          symbol: {
            color: [247, 150, 70, 161],
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
        labelingInfo: null,
      },
      extent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      supportsCoordinatesQuantization: false,
      hasLabels: false,
      geometryType: 'esriGeometryPoint',
    });
  });
});
