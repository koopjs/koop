const _ = require('lodash');
const { filterAndTransform } = require('./filter-and-transform');
const { logProviderDataWarnings } = require('./log-provider-data-warnings');
const { renderFeaturesResponse } = require('./render-features');
const { renderStatisticsResponse } = require('./render-statistics');
const {
  renderPrecalculatedStatisticsResponse,
} = require('./render-precalculated-statistics');
const { renderCountAndExtentResponse } = require('./render-count-and-extent');
const { getGeometryTypeFromGeojson } = require('../helpers');
const { validate } = require('./validate-query-request-parameters');

function query(json, requestParams = {}) {
  const { features, filtersApplied: { all: skipFiltering } = {} } = json;
  const { f: requestedFormat } = requestParams;

  validate(requestParams);

  if (shouldRenderPrecalculatedData(json, requestParams)) {
    return renderPrecalculatedData(json, requestParams);
  }

  logProviderDataWarnings(json, requestParams);

  const data =
    skipFiltering || !features ? json : filterAndTransform(json, requestParams);

  // TODO: Bug when count or extent requested.
  // QUESTION: Is this problematic if its an aggregation with stats?
  if (requestedFormat === 'geojson') {
    return {
      type: 'FeatureCollection',
      features: data.features,
    };
  }

  return renderGeoservicesResponse(data, {
    ...requestParams,
    attributeSample: _.get(json, 'features[0].properties'),
    geometryType: getGeometryTypeFromGeojson(json),
  });
}

function shouldRenderPrecalculatedData(json, requestParameters) {
  const { statistics, count, extent } = json;
  const { returnCountOnly, returnExtentOnly } = requestParameters;

  return (
    !!statistics ||
    (returnCountOnly === true && count !== undefined) ||
    (returnExtentOnly === true && extent && !returnCountOnly)
  );
}

function renderPrecalculatedData(
  data,
  {
    returnCountOnly,
    returnExtentOnly,
    outStatistics,
    groupByFieldsForStatistics,
  },
) {
  const { statistics, count, extent } = data;

  if (statistics) {
    return renderPrecalculatedStatisticsResponse(data, {
      outStatistics,
      groupByFieldsForStatistics,
    });
  }

  const retVal = {};

  if (returnCountOnly) {
    retVal.count = count;
  }

  if (returnExtentOnly) {
    retVal.extent = extent;
  }

  return retVal;
}

function renderGeoservicesResponse(data, params = {}) {
  const { returnCountOnly, returnExtentOnly, returnIdsOnly, outSR } = params;

  // TODO: if only count, and f=pbf need to encode response
  if (returnCountOnly || returnExtentOnly) {
    return renderCountAndExtentResponse(data, {
      returnCountOnly,
      returnExtentOnly,
      outSR,
    });
  }

  if (returnIdsOnly) {
    return renderIdsOnlyResponse(data);
  }

  if (data.statistics) {
    return renderStatisticsResponse(data, params);
  }

  return renderFeaturesResponse(data, params);
}

function renderIdsOnlyResponse({ features = [], metadata = {} }) {
  const objectIdFieldName = metadata.idField || 'OBJECTID';

  const objectIds = features.map(({ attributes }) => {
    return attributes[objectIdFieldName];
  });

  return {
    objectIdFieldName,
    objectIds,
  };
}

module.exports = query;
