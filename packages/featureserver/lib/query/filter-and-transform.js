const _ = require('lodash');
const { query } = require('@koopjs/winnow');
const helpers = require('../helpers');

function filterAndTransform (json, requestParams) {
  const { features, type, ...restJson } = json;
  const params = FilterAndTransformParams.create(requestParams)
    .removeParamsAlreadyApplied(json.filtersApplied)
    .addToEsri()
    .addInputCrs(json)
    .normalizeObjectIds();

  const result = query(json, params);

  const { objectIds, outStatistics } = params;

  if (outStatistics) {
    return {
      statistics: result,
      ...restJson
    };
  }

  if (!objectIds) {
    return result;
  }

  return {
    ...result,
    features: filterByObjectIds(result, objectIds)
  };
}

class FilterAndTransformParams {
  static create (requestParams) {
    return new FilterAndTransformParams(requestParams);
  }

  constructor (requestParams) {
    Object.assign(this, requestParams);
  }

  removeParamsAlreadyApplied (alreadyApplied) {
    for (const key in alreadyApplied) {
      if (key === 'projection') {
        delete this.outSR;
      }

      if (key === 'offset') {
        delete this.resultOffset;
      }

      if (key === 'limit') {
        delete this.resultRecordCount;
      }

      delete this[key];
    }

    return this;
  }

  addToEsri () {
    this.toEsri = this.f !== 'geojson' && !this.returnExtentOnly;
    return this;
  }

  addInputCrs (data = {}) {
    const { metadata = {} } = data;
    this.inputCrs = this.inputCrs || this.sourceSR || metadata.crs || helpers.getCollectionCrs(data) || 4326;
    delete this.sourceSR;
    return this;
  }

  normalizeObjectIds () {
    if (!this.objectIds) {
      return this;
    }

    let ids;
    if (Array.isArray(this.objectIds)) {
      ids = this.objectIds;
    } else if (typeof this.objectIds === 'string') {
      ids = this.objectIds.split(',');
    } else if (typeof this.objectIds === 'number') {
      ids = [this.objectIds];
    } else {
      const error = new Error('Invalid "objectIds" parameter.');
      error.code = 400;
      throw error;
    }

    this.objectIds = ids.map(i => {
      if (isNaN(i)) {
        return i;
      }

      return parseInt(i);
    });

    return this;
  }
}

function filterByObjectIds (data, objectIds) {
  const idField = _.get(data, 'metadata.idField') || 'OBJECTID';

  return data.features.filter(({ attributes = {}, properties = {} }) => {
    return objectIds.includes(attributes[idField]) || objectIds.includes(properties[idField]);
  });
}

module.exports = { filterAndTransform };
