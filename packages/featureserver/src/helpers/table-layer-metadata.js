const _ = require('lodash');
const joi = require('joi');
const defaults = require('../metadata-defaults');
const logManager = require('../log-manager');
const {
  LayerFields
} = require('./fields');

const supportedQueryFormatsArraySchema = joi.array().items(
  joi.string().allow('JSON', 'geojson', 'PBF')
).has(joi.string().valid('JSON')).message('must contain "JSON"');

const supportedQueryFormatsSchema = joi.alternatives().try(supportedQueryFormatsArraySchema, joi.string());

class TableLayerMetadata {
  static create (geojson, options = {}) {
    const {
      geojson: normalizedGeojson,
      options: normalizedOptions
    } = TableLayerMetadata.normalizeInput(geojson, options);
    const tableMetadata = new TableLayerMetadata();
    return tableMetadata.mixinOverrides(normalizedGeojson, normalizedOptions);
  }

  static normalizeInput (geojson, req) {
    const {
      metadata = {},
      capabilities,
      ...normalizedGeojson
    } = geojson;

    const {
      params: {
        layer: reqLayer
      } = {},
      query = {}
    } = req;

    const layerId = reqLayer != null ? reqLayer : req.layerId;

    // TODO: deprecate req.app.locals.config usage
    const {
      currentVersion,
      description
    } = _.get(req, 'app.locals.config.featureServer', {});

    const normalizedOptions = _.pickBy({
      currentVersion,
      description,
      layerId,
      ...query,
      ...metadata,
      capabilities: normalizeCapabilities(capabilities, metadata.capabilities)
    }, (value) => value);

    if (!normalizedGeojson.features) {
      normalizedGeojson.features = [];
    }

    return {
      geojson: normalizedGeojson,
      options: normalizedOptions
    };
  }

  constructor () {
    Object.assign(this, defaults.tableLayerDefaults());
  }

  mixinOverrides (geojson = {}, options = {}) {
    const {
      id,
      idField = 'OBJECTID',
      displayField,
      capabilities,
      layerId,
      hasStaticData,
      supportsPagination,
      hasAttachments,
      supportedQueryFormats,
    } = options;

    this._setFields(geojson, options);

    this._setId(layerId, id);

    this._setDisplayField(displayField, idField);

    this._setHasStaticData(hasStaticData);

    this._setCapabilities(capabilities);

    this._setUniqueIdField(idField);

    this._setPagination(supportsPagination);

    this._setDirectOverrides(options);

    this._setHasAttachments(hasAttachments);

    this.#setSupportedQueryFormats(supportedQueryFormats);

    return this;
  }

  _setFields (data, options) {
    const fields = LayerFields.create({ ...data, ...options });
    if (fields) {
      this.fields = fields;
    }
  }

  _setId (layerId, metadataId) {
    const requestPathLayerId = parseInt(layerId);
    const id = !isNaN(requestPathLayerId) ? requestPathLayerId : metadataId;

    if (id) {
      this.id = id;
    }
  }

  _setDisplayField (displayField, idField) {
    const overrideDisplayField = displayField || idField;

    if (overrideDisplayField) {
      this.displayField = overrideDisplayField;
    }
  }

  _setHasStaticData (hasStaticData) {
    if (typeof hasStaticData === 'boolean') {
      this.hasStaticData = hasStaticData;
    }
  }

  _setCapabilities (capabilities) {
    if (!capabilities) {
      return;
    }

    if (capabilities.list) {
      this.capabilities = capabilities.list;
      return;
    }

    if (_.has(capabilities, 'extract') && !this.capabilities.includes('Extract')) {
      this.capabilities = `${this.capabilities},Extract`;
    }
  }

  _setUniqueIdField (idField) {
    if (idField) {
      this.uniqueIdField.name = idField;
    }
  }

  _setPagination (supportsPagination) {
    if (typeof supportsPagination === 'boolean') {
      this.advancedQueryCapabilities.supportsPagination = supportsPagination;
    }
  }

  _setHasAttachments (hasAttachments) {
    if (hasAttachments != null && typeof hasAttachments === 'boolean') {
      this.hasAttachments = hasAttachments;
    }
  }

  _setDirectOverrides (options) {
    const {
      name,
      relationships,
      description,
      copyrightText,
      templates,
      idField,
      timeInfo,
      maxRecordCount,
      defaultVisibility,
      currentVersion,
      hasZ
    } = options;

    _.merge(this, {
      name,
      relationships,
      description,
      copyrightText,
      templates,
      objectIdField: idField,
      timeInfo,
      maxRecordCount,
      defaultVisibility,
      currentVersion,
      hasZ
    });
  }

  #setSupportedQueryFormats (supportedQueryFormats) {
    if(!supportedQueryFormats) {
      return;
    }

    try {
      validateQueryFormatsArray(supportedQueryFormats);
      
      if (Array.isArray(supportedQueryFormats)) {
        this.supportedQueryFormats = supportedQueryFormats.join(',');
        return;
      }
  
      validateQueryFormatsArray(supportedQueryFormats.split(',').map(val => val.trim()));
      this.supportedQueryFormats = supportedQueryFormats;
    } catch (error) {
      logManager.logger.error(error.message);
    }
  }
}

function normalizeCapabilities (capabilities, metadataCapabilites) {
  if (_.isString(metadataCapabilites)) {
    return {
      ...capabilities,
      list: metadataCapabilites
    };
  }

  return {
    ...(metadataCapabilites || {}),
    ...capabilities
  };
}

function validateQueryFormatsArray(arr) {
  const { error } = supportedQueryFormatsSchema.validate(arr);
  if (error) {
    throw new Error (`"supportedQueryFormats" override is invalid; ${error.message}. skipping override`);
  }
}

module.exports = TableLayerMetadata;
