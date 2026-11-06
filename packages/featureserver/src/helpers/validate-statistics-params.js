const joi = require('joi');
const { normalizeRequestParameters } = require('./normalize-request-params');

const parameterSchema = joi
  .object({
    outStatistics: joi.array().items(joi.object().unknown()),
    groupByFieldsForStatistics: joi.alternatives(joi.string(), joi.array()),
  })
  .unknown();

const statisticFieldNameRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_ ]+$/;
const statisticTypes = ['count', 'sum', 'avg', 'var', 'max', 'min'];

function validateStatisticsRequest({ body, query }) {
  validateStatisticsParams(normalizeRequestParameters(body, query));
}

function validateStatisticsParams(parameters = {}) {
  const { error } = parameterSchema.validate(parameters);

  if (error) {
    error.code = 400;
    throw error;
  }

  const { outStatistics = [], groupByFieldsForStatistics = [] } = parameters;

  for (const statistic of outStatistics) {
    validateFieldName(statistic.outStatisticFieldName, 'outStatisticFieldName');
    validateFieldName(statistic.onStatisticField, 'onStatisticField');

    if (!statisticTypes.includes(statistic.statisticType)) {
      throw makeError(
        `Invalid configuration: statisticType ` +
          `"${statistic.statisticType}" is invalid. ` +
          `It must be one of the following: ${statisticTypes.join(', ')}.`,
      );
    }
  }

  const groupByFields = Array.isArray(groupByFieldsForStatistics)
    ? groupByFieldsForStatistics
    : groupByFieldsForStatistics.split(',').map((field) => field.trim());

  for (const groupByField of groupByFields) {
    validateFieldName(groupByField, 'groupByField');
  }
}

function validateFieldName(name, parameter) {
  if (parameter === 'outStatisticFieldName' && name === undefined) {
    return;
  }

  if (typeof name !== 'string' || !statisticFieldNameRegex.test(name)) {
    throw makeError(
      `Invalid configuration: ${parameter} "${name}" is invalid. ` +
        'It must contain only letters, numbers, spaces, and underscores, ' +
        'and must contain at least one letter or number.',
    );
  }
}

function makeError(message) {
  const error = new Error(message);
  error.code = 400;
  return error;
}

module.exports = { validateStatisticsParams, validateStatisticsRequest };
