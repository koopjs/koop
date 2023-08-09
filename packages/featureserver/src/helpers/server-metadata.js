const _ = require('lodash');
const { CURRENT_VERSION, FULL_VERSION } = require('../constants');

const DEFAULTS = {
  currentVersion: CURRENT_VERSION,
  fullVersion: FULL_VERSION,
  serviceDescription:
    'This is a feature service exposed with Koop, an open source project that turns APIs into features. Service Description information may not be available for all services. For more information, check out https://github.com/koopjs/koop.',
  maxRecordCount: 2000,
  description:
    'This is a feature service exposed with Koop, an open source project that turns APIs into features. Service Description information may not be available for all services. For more information, check out https://github.com/koopjs/koop.',
  copyrightText:
    'Copyright information varies from provider to provider, for more information please contact the source of this data',
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326,
  },
  fullExtent: {
    xmin: -180,
    ymin: -90,
    xmax: 180,
    ymax: 90,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326,
    },
  },
  initialExtent: {
    xmin: -180,
    ymin: -90,
    xmax: 180,
    ymax: 90,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326,
    },
  },
  hasStaticData: false,
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

const OVERRIDABLE_DEFAULTS = [
  'currentVersion',
  'fullVersion',
  'serviceDescription',
  'description',
  'maxRecordCount',
  'copyrightText',
  'spatialReference',
  'initialExtent',
  'fullExtent',
  'hasStaticData',
  'units',
  'layers',
  'tables',
  'relationships'
];

class ServerMetadata {
  static create (options) {
    return new ServerMetadata(options);
  }

  constructor(options) {
    const { relationships = [] } = options;
    const overrides = _.chain(options)
      .pick(options, OVERRIDABLE_DEFAULTS)
      .pickBy((prop) => !_.isUndefined(prop))
      .value();

    overrides.serviceDescription =
      overrides.serviceDescription ? overrides. serviceDescription : overrides.description;
    overrides.initialExtent = overrides.initialExtent ? overrides.initialExtent : overrides.fullExtent;

    Object.assign(this, {
      ...DEFAULTS,
      ..._.pickBy(overrides, (prop) => !_.isUndefined(prop)),
    });

    this.supportsRelationshipsResource = relationships.length > 0;
  }
}


module.exports = ServerMetadata;
