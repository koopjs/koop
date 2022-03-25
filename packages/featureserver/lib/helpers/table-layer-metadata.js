const _ = require('lodash')
const { version } = require('../defaults')
const { computeFieldObject } = require('../field')

class TableLayerMetadata {
  static create (geojson = {}, options = {}) {
    const {
      geojson: normalizedGeojson,
      options: normalizedOptions
    } = TableLayerMetadata.normalizeInput(geojson, options)
    const tableMetadata = new TableLayerMetadata()
    return tableMetadata.mixinOverrides(normalizedGeojson, normalizedOptions)
  }

  static normalizeInput (geojson, options) {
    const {
      metadata = {},
      capabilities,
      ...normalizedGeojson
    } = geojson

    const {
      params: { layer: layerId } = {},
      query = {},
      ...otherOptions
    } = options

    const normalizedOptions = {
      layerId,
      ...query,
      ...otherOptions,
      ...metadata,
      capabilities: normalizeCapabilities(capabilities, metadata.capabilities)
    }

    if (!normalizedGeojson.features) {
      normalizedGeojson.features = []
    }

    return {
      geojson: normalizedGeojson,
      options: normalizedOptions
    }
  }

  constructor () {
    Object.assign(this, {
      id: 0,
      name: 'Not Set',
      type: 'Table',
      description: 'This is a feature service powered by https://github.com/featureserver/featureserver',
      copyrightText: ' ',
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
      maxRecordCount: 2000,
      supportsStatistics: true,
      supportsAdvancedQueries: true,
      supportedQueryFormats: 'JSON',
      ownershipBasedAccessControlForFeatures: {
        allowOthersToQuery: true
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
        supportsQueryWithDistance: true
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
        isSystemMaintained: true
      },
      ...version
    })
  }

  mixinOverrides (geojson = {}, options = {}) {
    const {
      id,
      idField,
      displayField,
      capabilities,
      layerId,
      hasStaticData
    } = options

    this._setFields(geojson, options)

    this._setId(layerId, id)

    this._setDisplayField(displayField, idField)

    this._setHasStaticData(hasStaticData)

    this._setCapabilities(capabilities)

    this._setUniqueIdField(idField)

    this._setDirectOverrides(options)

    return this
  }

  _setFields (data, options) {
    const fields = computeFieldObject(data, 'layer', options)
    if (fields) {
      this.fields = fields
    }
  }

  _setId (layerId, metadataId) {
    const requestPathLayerId = parseInt(layerId)
    const id = !isNaN(requestPathLayerId) ? requestPathLayerId : metadataId

    if (id) {
      this.id = id
    }
  }

  _setDisplayField (metadataDisplayField, metadataIdField) {
    const overrideDisplayField = metadataDisplayField || metadataIdField

    if (overrideDisplayField) {
      this.displayField = overrideDisplayField
    }
  }

  _setHasStaticData (hasStaticData) {
    if (typeof hasStaticData === 'boolean') {
      this.hasStaticData = hasStaticData
    }
  }

  _setCapabilities (capabilities) {
    if (!capabilities) {
      return
    }

    if (capabilities.list) {
      this.capabilities = capabilities.list
      return
    }

    if (_.has(capabilities, 'extract') && !this.capabilities.includes('Extract')) {
      this.capabilities = `${this.capabilities},Extract`
    }
  }

  _setUniqueIdField (metadataIdField) {
    if (metadataIdField) {
      this.uniqueIdField.name = metadataIdField
    }
  }

  _setDirectOverrides (options) {
    const {
      name,
      relationships,
      description,
      templates,
      idField,
      timeInfo,
      maxRecordCount,
      defaultVisibility
    } = options

    _.merge(this, {
      name,
      relationships,
      description,
      templates,
      objectIdField: idField,
      timeInfo,
      maxRecordCount,
      defaultVisibility
    })
  }
}

function normalizeCapabilities (capabilities, metadataCapabilites) {
  if (_.isString(metadataCapabilites)) {
    return {
      ...capabilities,
      list: metadataCapabilites
    }
  }

  return {
    ...(metadataCapabilites || {}),
    ...capabilities
  }
}

module.exports = TableLayerMetadata
