const joi = require('joi');
const _ = require('lodash');
const CURRENT_VERSION = 11.1;
const FULL_VERSION = '11.1.0';
const MAX_RECORD_COUNT = 2000;
const description =
  'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.';
const copyrightText =
  'Copyright information varies by provider. For more information please contact the source of this data.';
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

const defaultOverridables = {
  currentVersion: CURRENT_VERSION,
  fullVersion: FULL_VERSION,
  maxRecordCount: MAX_RECORD_COUNT,
  server: {
    serviceDescription: description,
    description,
    copyrightText,
    fullExtent: EXTENT,
    initialExtent: EXTENT,
    hasStaticData: false,
    spatialReference: SPATIAL_REFERENCE,
  },
  layer: {
    description,
    copyrightText,
    extent: EXTENT,
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
    serviceDescription: joi.string(),
    description: joi.string(),
    copyrightText: joi.string(),
    hasStaticData: joi.boolean(),
    spatialReference: spatialReferenceSchema,
    initialExtent: esriExtentSchema,
    fullExtent: esriExtentSchema,
  }),
  layer: joi.object({
    description: joi.string(),
    copyrightText: joi.string(),
    extent: esriExtentSchema,
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
      fullVersion: this.#overridables.fullVersion,
      maxRecordCount: this.#overridables.maxRecordCount,
      serviceDescription: this.#overridables.server.serviceDescription,
      description: this.#overridables.server.description,
      copyrightText: this.#overridables.server.copyrightText,
      spatialReference: this.#overridables.server.spatialReference,
      fullExtent: this.#overridables.server.fullExtent,
      initialExtent: this.#overridables.server.initialExtent,
      hasStaticData: this.#overridables.server.hasStaticData,
      units: 'esriDecimalDegrees',
      tables: [],
      layers: [],
      supportedQueryFormats: 'JSON',
      capabilities: 'Query',
      syncEnabled: false,
      hasVersionedData: false,
      supportsDisconnectedEditing: false,
      supportsRelationshipsResource: false,
      allowGeometryUpdates: false,
    };
  }

  tableLayerDefaults() {
    return {
      currentVersion: this.#overridables.currentVersion,
      fullVersion: this.#overridables.fullVersion,
      id: 0,
      name: 'Not Set',
      type: 'Table',
      description: this.#overridables.layer.description,
      copyrightText: this.#overridables.layer.copyrightText,
      parentLayer: null,
      subLayers: null,
      defaultVisibility: true,
      hasAttachments: false,
      htmlPopupType: 'esriServerHTMLPopupTypeNone',
      displayField: 'OBJECTID',
      typeIdField: null,
      fields: [],
      relationships: [],
      capabilities: 'Query',
      maxRecordCount: this.#overridables.maxRecordCount,
      supportsStatistics: true,
      supportsAdvancedQueries: true,
      supportedQueryFormats: 'JSON',
      ownershipBasedAccessControlForFeatures: {
        allowOthersToQuery: true,
      },
      useStandardizedQueries: true,
      advancedQueryCapabilities: {
        useStandardizedQueries: true,
        supportsStatistics: true,
        supportsOrderBy: true,
        supportsDistinct: true,
        supportsPagination: true,
        supportsTrueCurve: false,
        supportsReturningQueryExtent: true,
        supportsQueryWithDistance: true,
      },
      canModifyLayer: false,
      dateFieldsTimeReference: null,
      isDataVersioned: false,
      supportsRollbackOnFailureParameter: true,
      hasM: false,
      hasZ: false,
      allowGeometryUpdates: true,
      objectIdField: 'OBJECTID',
      globalIdField: '',
      types: [],
      templates: [],
      hasStaticData: false,
      timeInfo: {},
      uniqueIdField: {
        name: 'OBJECTID',
        isSystemMaintained: true,
      },
    };
  }

  featureLayerDefaults() {
    return {
      ...this.tableLayerDefaults(),
      type: 'Feature Layer',
      minScale: 0,
      maxScale: 0,
      canScaleSymbols: false,
      drawingInfo: {
        renderer: {},
        labelingInfo: null,
      },
      extent: this.#overridables.layer.extent,
      supportsCoordinatesQuantization: false,
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
      throw new Error(
        `FeatureServer default settings are invalid: ${error.details[0].message}.`,
      );
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
