const joi = require('joi');
const _ = require('lodash');
const CURRENT_VERSION = 11.2;
const FULL_VERSION = '11.2.0';
const MAX_RECORD_COUNT = 2000;
const SERVICE_DESCRIPTION =
  'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.'; // eslint-disable-line
const LAYER_DESCRIPTION =
  'This is a feature layer exposed with Koop. For more information go to https://github.com/koopjs/koop.'; // eslint-disable-line
const COPYRIGHT =
  'Copyright information varies by provider. For more information please contact the source of this data.'; // eslint-disable-line
const SPATIAL_REFERENCE = {
  wkid: 4326,
  latestWkid: 4326,
};
const EXTENT = {
  xmin: -180,
  ymin: -90,
  xmax: 180,
  ymax: 90,
  spatialReference: SPATIAL_REFERENCE,
};
const SUPPORTED_QUERY_FORMATS = 'JSON,geojson,PBF';

const defaultOverridables = {
  currentVersion: CURRENT_VERSION,
  fullVersion: FULL_VERSION,
  maxRecordCount: MAX_RECORD_COUNT,
  server: {
    serviceDescription: SERVICE_DESCRIPTION,
    description: SERVICE_DESCRIPTION,
    copyrightText: COPYRIGHT,
    fullExtent: EXTENT,
    initialExtent: EXTENT,
    hasStaticData: false,
    spatialReference: SPATIAL_REFERENCE,
  },
  layer: {
    description: LAYER_DESCRIPTION,
    copyrightText: COPYRIGHT,
    extent: EXTENT,
    supportedQueryFormats: SUPPORTED_QUERY_FORMATS,
  },
};

const spatialReferenceSchema = joi.object({
  wkid: joi.number().integer().required(),
  latestWkid: joi.number().integer(),
});

const esriExtentSchema = joi.object({
  xmin: joi.number().required(),
  xmax: joi.number().required(),
  ymin: joi.number().required(),
  ymax: joi.number().required(),
  spatialReference: spatialReferenceSchema.required(),
});

const overridablesSchema = joi.object({
  currentVersion: joi.number(),
  fullVersion: joi.string(),
  maxRecordCount: joi.number(),
  server: joi.object({
    serviceDescription: joi.string().allow(null, ''),
    description: joi.string().allow(null, ''),
    copyrightText: joi.string().allow(null, ''),
    hasStaticData: joi.boolean(),
    spatialReference: spatialReferenceSchema,
    initialExtent: esriExtentSchema,
    fullExtent: esriExtentSchema,
  }),
  layer: joi.object({
    description: joi.string().allow(null, ''),
    copyrightText: joi.string().allow(null, ''),
    extent: esriExtentSchema,
    supportedQueryFormats: joi.string().allow('JSON', 'JSON,geojson'),
  }),
});

class MetadataDefaults {
  #overridables;
  constructor() {
    this.#overridables = _.cloneDeep(defaultOverridables);
  }

  serverDefaults() {
    return {
      currentVersion: this.#overridables.currentVersion,
      serviceDescription: this.#overridables.server.serviceDescription,
      hasVersionedData: false,
      supportsDisconnectedEditing: false,
      hasStaticData: this.#overridables.server.hasStaticData,
      hasSharedDomains: false,
      maxRecordCount: this.#overridables.maxRecordCount,
      supportedQueryFormats: 'JSON',
      supportsVCSProjection: false,
      supportedExportFormats: '',
      capabilities: 'Query',
      description: this.#overridables.server.description,
      copyrightText: this.#overridables.server.copyrightText,
      spatialReference: this.#overridables.server.spatialReference,
      fullExtent: this.#overridables.server.fullExtent,
      initialExtent: this.#overridables.server.initialExtent,
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
      layers: [],
    };
  }

  tableLayerDefaults() {
    return {
      currentVersion: this.#overridables.currentVersion,
      id: 0,
      name: 'Not Set',
      type: 'Table',
      displayField: '',
      description: this.#overridables.layer.description,
      copyrightText: this.#overridables.layer.copyrightText,
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
      supportedPbfFeatureEncodings: 'esriDefault',
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
      uniqueIdField: {
        name: 'OBJECTID',
        isSystemMaintained: true,
      },
      globalIdField: '',
      typeIdField: '',
      dateFieldsTimeReference: {
        timeZone: 'UTC',
        respectsDaylightSaving: false,
      },
      preferredTimeReference: null,
      templates: [],
      supportedQueryFormats: this.#overridables.layer.supportedQueryFormats,
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
      maxRecordCount: this.#overridables.maxRecordCount,
      standardMaxRecordCount: this.#overridables.maxRecordCount,
      standardMaxRecordCountNoGeometry: this.#overridables.maxRecordCount,
      tileMaxRecordCount: this.#overridables.maxRecordCount,
      maxRecordCountFactor: 1,
      fields: [],
      relationships: [],
      capabilities: 'Query',
      ownershipBasedAccessControlForFeatures: {
        allowOthersToQuery: true,
      },
      types: [],
      timeInfo: {},
    };
  }

  featureLayerDefaults() {
    return {
      ...this.tableLayerDefaults(),
      type: 'Feature Layer',
      minScale: 0,
      maxScale: 0,
      drawingInfo: {
        renderer: {},
        labelingInfo: null,
      },
      extent: this.#overridables.layer.extent,
      supportsCoordinatesQuantization: true, // TODO
      hasLabels: false,
    };
  }

  restInfoDefaults() {
    return {
      currentVersion: this.#overridables.currentVersion,
      fullVersion: this.#overridables.fullVersion,
    };
  }

  maxRecordCount() {
    return this.#overridables.maxRecordCount;
  }

  setDefaults(options) {
    const { error, value } = overridablesSchema.validate(options, {
      stripUnknown: true,
    });

    if (error) {
      throw new Error(`FeatureServer default settings are invalid: ${error.details[0].message}.`);
    }

    this.#overridables = _.merge(this.#overridables, value);
    return;
  }

  reset() {
    this.#overridables = _.cloneDeep(defaultOverridables);
  }
}

const defaults = new MetadataDefaults();

module.exports = defaults;
