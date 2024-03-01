const _ = require('lodash');
const wktParser = require('wkt-parser');
const projCodes = require('@esri/proj-codes');
const logManager = require('../log-manager');
const esriUnitsLookup = require('./esri-units-lookup');
const defaults = require('../metadata-defaults');

const OVERRIDABLE_DEFAULTS = [
  'currentVersion',
  'serviceDescription',
  'description',
  'maxRecordCount',
  'copyrightText',
  'spatialReference',
  'initialExtent',
  'fullExtent',
  'hasStaticData',
  'layers',
  'tables',
  'relationships',
];

class ServerMetadata {
  static create(options) {
    return new ServerMetadata(options);
  }

  constructor(options = {}) {
    const { relationships = [] } = options;
    const overrides = _.chain(options)
      .pick(options, OVERRIDABLE_DEFAULTS)
      .pickBy((prop) => !_.isUndefined(prop))
      .value();

    overrides.serviceDescription = overrides.serviceDescription
      ? overrides.serviceDescription
      : overrides.description;
    overrides.initialExtent = overrides.initialExtent
      ? overrides.initialExtent
      : overrides.fullExtent;

    Object.assign(this, {
      ...defaults.serverDefaults(),
      ..._.pickBy(overrides, (prop) => !_.isUndefined(prop)),
    });

    this.supportsRelationshipsResource = relationships.length > 0;

    if (options.spatialReference) {
      this.units = getUnits(options.spatialReference) || this.units;
    }
  }
}

function getUnits({ latestWkid, wkid, wkt }) {
  try {
    if (!wkt) {
      ({ wkt } = projCodes.lookup(latestWkid || wkid));
    }

    const units = wktParser(wkt)?.units;
    return esriUnitsLookup(units);
  } catch (error) {
    logManager.logger.debug(
      `Could not set feature service units from spatial reference: ${error}`,
    );
  }
}

module.exports = ServerMetadata;
