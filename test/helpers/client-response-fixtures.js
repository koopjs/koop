function getServerInfo(id) {
  return {
    currentVersion: 11.1,
    fullVersion: '11.1.0',
    maxRecordCount: 2000,
    serviceDescription:
      'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
    description:
      'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
    copyrightText:
      'Copyright information varies by provider. For more information please contact the source of this data.',
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
    hasStaticData: false,
    units: 'esriDecimalDegrees',
    tables: [],
    layers: [
      {
        id: 0,
        name: `${id}.geojson`,
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 0,
        maxScale: 0,
        geometryType: 'esriGeometryPoint',
      },
    ],
    supportedQueryFormats: 'JSON',
    capabilities: 'Query',
    syncEnabled: false,
    hasVersionedData: false,
    supportsDisconnectedEditing: false,
    supportsRelationshipsResource: false,
    allowGeometryUpdates: false,
    relationships: [],
  };
}

function getLayersInfo(filename, idField) {
  return {
    layers: [
      {
        currentVersion: 11.1,
        fullVersion: '11.1.0',
        id: 0,
        name: `${filename}.geojson`,
        type: 'Feature Layer',
        description:
          'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
        copyrightText:
          'Copyright information varies by provider. For more information please contact the source of this data.',
        parentLayer: null,
        subLayers: null,
        defaultVisibility: true,
        hasAttachments: false,
        htmlPopupType: 'esriServerHTMLPopupTypeNone',
        displayField: idField,
        typeIdField: null,
        fields: [
          {
            name: idField,
            type: 'esriFieldTypeOID',
            alias: idField,
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
        objectIdField: idField,
        globalIdField: '',
        types: [],
        templates: [],
        hasStaticData: false,
        timeInfo: {},
        uniqueIdField: { name: idField, isSystemMaintained: true },
        minScale: 0,
        maxScale: 0,
        canScaleSymbols: false,
        drawingInfo: {
          renderer: {
            type: 'simple',
            symbol: {
              color: [45, 172, 128, 161],
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
          xmin: -120,
          xmax: -80,
          ymin: 25,
          ymax: 45,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        supportsCoordinatesQuantization: false,
        hasLabels: false,
        geometryType: 'esriGeometryPoint',
      },
    ],
    tables: [],
  };
}

function getLayerInfo(filename, idField) {
  return getLayersInfo(filename, idField).layers[0];
}

function getFirst2000(idField, objectIds) {
  return {
    objectIdFieldName: idField,
    uniqueIdField: { name: idField, isSystemMaintained: true },
    globalIdFieldName: '',
    hasZ: false,
    hasM: false,
    spatialReference: { wkid: 102100, latestWkid: 3857 },
    fields: [
      {
        name: idField,
        type: 'esriFieldTypeOID',
        alias: idField,
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
    ],
    features: [
      {
        attributes: { [idField]: objectIds[0] },
        geometry: { x: -8905559.263461886, y: 2875744.6243522423 },
      },
      {
        attributes: { [idField]: objectIds[1] },
        geometry: { x: -13358338.895192828, y: 5621521.486192066 },
      },
      {
        attributes: { [idField]: objectIds[2] },
        geometry: { x: -11131949.079327356, y: 4865942.279503176 },
      },
    ],
    exceededTransferLimit: false,
    geometryType: 'esriGeometryPoint',
  };
}

function filterByObjectIds (idField, objectIds) {
  return {
    objectIdFieldName: idField,
    uniqueIdField: { name: idField, isSystemMaintained: true },
    globalIdFieldName: '',
    hasZ: false,
    hasM: false,
    spatialReference: { wkid: 102100, latestWkid: 3857 },
    fields: [
      {
        name: idField,
        type: 'esriFieldTypeOID',
        alias: idField,
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        alias: 'timestamp',
        defaultValue: null,
        domain: null,
        length: 36,
        name: 'timestamp',
        sqlType: 'sqlTypeOther',
        type: 'esriFieldTypeDate',
      },
      {
        alias: 'label',
        defaultValue: null,
        domain: null,
        length: 128,
        name: 'label',
        sqlType: 'sqlTypeOther',
        type: 'esriFieldTypeString',
      },
      {
        alias: 'category',
        defaultValue: null,
        domain: null,
        length: 128,
        name: 'category',
        sqlType: 'sqlTypeOther',
        type: 'esriFieldTypeString',
      },
    ],
    features: [
      {
        attributes: {
          [idField]: objectIds[0],
          category: 'pinto',
          label: 'White Leg',
          timestamp: 1681143330000,
        },
        geometry: { x: -8905559.263461886, y: 2875744.6243522423 },
      },
    ],
    exceededTransferLimit: false,
    geometryType: 'esriGeometryPoint',
  };
}

function getOutStatistics() {
  return {
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
  };
}

function paginated(IDFIELD) {
  return {
    objectIdFieldName: IDFIELD,
    uniqueIdField: { name: IDFIELD, isSystemMaintained: true },
    globalIdFieldName: '',
    hasZ: false,
    hasM: false,
    spatialReference: { wkid: 102100, latestWkid: 3857 },
    fields: [
      {
        alias: 'category',
        defaultValue: null,
        domain: null,
        length: 128,
        name: 'category',
        sqlType: 'sqlTypeOther',
        type: 'esriFieldTypeString',
      },
    ],
    features: [
      {
        attributes: {
          category: 'draft',
        },
      },
    ],
    exceededTransferLimit: false,
    geometryType: 'esriGeometryPoint',
  };
}

function getWithFilter(idField, objectIds){
  return {
    objectIdFieldName: idField,
    uniqueIdField: { name: idField, isSystemMaintained: true },
    globalIdFieldName: '',
    hasZ: false,
    hasM: false,
    spatialReference: { wkid: 102100, latestWkid: 3857 },
    fields: [
      {
        name: idField,
        type: 'esriFieldTypeOID',
        alias: idField,
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
      {
        attributes: { category: 'pinto', [idField]: objectIds[0] },
        geometry: { x: -8905559.263461886, y: 2875744.6243522423 },
      },
      {
        attributes: { category: 'pinto', [idField]: objectIds[1] },
        geometry: { x: -13358338.895192828, y: 5621521.486192066 },
      },
    ],
    exceededTransferLimit: false,
    geometryType: 'esriGeometryPoint',
  };
}

function getAttributeTable(idField, objectIds) {
  return {
    objectIdFieldName: idField,
    uniqueIdField: { name: idField, isSystemMaintained: true },
    globalIdFieldName: '',
    hasZ: false,
    hasM: false,
    spatialReference: { wkid: 4326, latestWkid: 4326 },
    fields: [
      {
        name: idField,
        type: 'esriFieldTypeOID',
        alias: idField,
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
          [idField]: objectIds[0],
          timestamp: 1681143330000,
          label: 'White Leg',
          category: 'pinto',
        },
      },
      {
        attributes: {
          [idField]: objectIds[1],
          timestamp: 1586708130000,
          label: 'Fireman',
          category: 'pinto',
        },
      },
      {
        attributes: {
          [idField]: objectIds[2],
          timestamp: 1428768930000,
          label: 'Workhorse',
          category: 'draft',
        },
      },
    ],
    exceededTransferLimit: false,
    geometryType: 'esriGeometryPoint',
  };
}
module.exports = {
  getServerInfo,
  getLayersInfo,
  getLayerInfo,
  getFirst2000,
  filterByObjectIds,
  getOutStatistics,
  paginated,
  getWithFilter,
  getAttributeTable
};
