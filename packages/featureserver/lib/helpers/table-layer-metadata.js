const _ = require('lodash')
const {
  CURRENT_VERSION,
  FULL_VERSION
} = require('../constants')
const {
  LayerFields
} = require('../helpers/fields')

class TableLayerMetadata {
  static create (geojson = {}, options = {}) {
    const {
      geojson: normalizedGeojson,
      options: normalizedOptions
    } = TableLayerMetadata.normalizeInput(geojson, options)
    const tableMetadata = new TableLayerMetadata()
    return tableMetadata.mixinOverrides(normalizedGeojson, normalizedOptions)
  }

  static normalizeInput (geojson, req) {
    const {
      metadata = {},
      capabilities,
      ...normalizedGeojson
    } = geojson

    const {
      params: {
        layer: layerId
      } = {},
      query = {}
    } = req

    const {
      currentVersion,
      fullVersion,
      description
    } = _.get(req, 'app.locals.config.featureServer', {})

    const normalizedOptions = _.pickBy({
      currentVersion,
      fullVersion,
      description,
      layerId,
      ...query,
      ...metadata,
      capabilities: normalizeCapabilities(capabilities, metadata.capabilities)
    }, (value) => value)

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
      currentVersion: CURRENT_VERSION,
      fullVersion: FULL_VERSION
    })
  }

  mixinOverrides (geojson = {}, options = {}) {
    const {
      id,
      idField,
      displayField,
      capabilities,
      layerId,
      hasStaticData,
      supportsPagination,
      hasAttachments
    } = options

    this._setFields(geojson, options)

    this._setId(layerId, id)

    this._setDisplayField(displayField, idField)

    this._setHasStaticData(hasStaticData)

    this._setCapabilities(capabilities)

    this._setUniqueIdField(idField)

    this._setPagination(supportsPagination)

    this._setDirectOverrides(options)

    this._setHasAttachments(hasAttachments)

    return this
  }

  _setFields (data, options) {
    const fields = LayerFields.create({ ...data, ...options })
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

  _setDisplayField (displayField, idField) {
    const overrideDisplayField = displayField || idField

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

  _setUniqueIdField (idField) {
    if (idField) {
      this.uniqueIdField.name = idField
    }
  }

  _setPagination (supportsPagination) {
    if (typeof supportsPagination === 'boolean') {
      this.advancedQueryCapabilities.supportsPagination = supportsPagination
    }
  }

  _setHasAttachments (hasAttachments) {
    if (hasAttachments != null && typeof hasAttachments === 'boolean') {
      this.hasAttachments = hasAttachments
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
      fullVersion
    } = options

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
      fullVersion
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
