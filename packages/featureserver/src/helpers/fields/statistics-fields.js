const { isDate } = require('../data-type-utils');
const { getEsriTypeFromDefinition } = require('./esri-type-utils');
const { ESRI_FIELD_TYPE_DATE } = require('./constants');
const {
  StatisticField,
  StatisticDateField,
  FieldFromFieldDefinition,
  FieldFromKeyValue
} = require('./field-classes');

class StatisticsFields {
  static normalizeOptions (inputOptions = {}) {
    const {
      statistics,
      metadata: {
        fields
      } = {},
      groupByFieldsForStatistics = [],
      attributeSample,
      ...options
    } = inputOptions;


    return {
      statisticsSample: Array.isArray(statistics) ? statistics[0] : statistics,
      fieldDefinitions: options.fieldDefinitions || options.fields || fields,
      groupByFieldsForStatistics: getGroupByFields(groupByFieldsForStatistics),
      ...options
    };
  }

  static create (inputOptions) {
    const options = StatisticsFields.normalizeOptions(inputOptions);
    return new StatisticsFields(options);
  }

  constructor (options = {}) {
    const {
      statisticsSample,
      groupByFieldsForStatistics = [],
      fieldDefinitions = [],
      outStatistics
    } = options;
    const dateFieldRegexs = getDateFieldRegexs(fieldDefinitions, outStatistics);

    this.fields = Object
      .entries(statisticsSample)
      .map(([key, value]) => {
        if (groupByFieldsForStatistics.includes(key)) {
          const fieldDefinition = fieldDefinitions.find(({ name }) => name === key);

          if (fieldDefinition) {
            return new FieldFromFieldDefinition(fieldDefinition);
          }

          return new FieldFromKeyValue(key, value);
        }

        if (isDateField(dateFieldRegexs, key, value)) {
          return new StatisticDateField(key);
        }

        return new StatisticField(key);
      });

    return this.fields;
  }
}

function getGroupByFields (inputVal) {
  if (Array.isArray(inputVal)) {
    return inputVal;
  }

  return inputVal.split(',').map(str => str.trim());
}

function isDateField (regexs, fieldName, value) {
  return regexs.some(regex => {
    return regex.test(fieldName);
  }) || isDate(value);
}

function getDateFieldRegexs (fieldDefinitions = [], outStatistics = []) {
  const dateFields = fieldDefinitions.filter(({ type }) => {
    return getEsriTypeFromDefinition(type) === ESRI_FIELD_TYPE_DATE;
  }).map(({ name }) => name);

  return outStatistics
    .filter(({ onStatisticField }) => dateFields.includes(onStatisticField))
    .map((statistic) => {
      const {
        onStatisticField,
        outStatisticFieldName
      } = statistic;

      const name = outStatisticFieldName || onStatisticField;
      const spaceEscapedName = name.replace(/\s/g, '_');
      return new RegExp(`${spaceEscapedName}$`);
    });
}

module.exports = StatisticsFields;
