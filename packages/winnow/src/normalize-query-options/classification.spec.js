const test = require('tape');
const normalizeClassification = require('./classification');

test('undefined', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({});
  t.equal(normalized, undefined);
});

test('return classification', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classification: 'some classification',
  });
  t.equal(normalized, 'some classification');
});

test('classificationDef without type should throw error', (t) => {
  t.plan(1);
  try {
    normalizeClassification({ classificationDef: {} });
  } catch (error) {
    t.equal(error.message, 'Input classification type invalid: undefined');
  }
});

test('classificationDef of type "classBreaksDef"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyEqualInterval',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByField',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'equalInterval',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'field',
    normField: 'def',
  });
});

test('classificationMethod "esriClassifyNaturalBreaks"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyNaturalBreaks',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByField',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'naturalBreaks',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'field',
    normField: 'def',
  });
});

test('classificationMethod "esriClassifyQuantile"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyQuantile',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByField',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'quantile',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'field',
    normField: 'def',
  });
});

test('classificationMethod "esriClassifyGeometricalInterval"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyGeometricalInterval',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByField',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'geomInterval',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'field',
    normField: 'def',
  });
});

test('classificationMethod "esriClassifyStandardDeviation"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyStandardDeviation',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByField',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'stddev',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'field',
    normField: 'def',
  });
});

test('transformationMethod "esriNormalizeByLog"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyStandardDeviation',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByLog',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'stddev',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'log',
    normField: 'def',
  });
});

test('transformationMethod "esriNormalizeByPercentOfTotal"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'classBreaksDef',
      classificationField: 'abc',
      classificationMethod: 'esriClassifyStandardDeviation',
      standardDeviationInterval: 10,
      breakCount: 99,
      normalizationType: 'esriNormalizeByPercentOfTotal',
      normalizationField: 'def',
    },
  });
  t.deepEquals(normalized, {
    type: 'classes',
    field: 'abc',
    method: 'stddev',
    stddev_intv: 10,
    breakCount: 99,
    normType: 'percent',
    normField: 'def',
  });
});

test('classificationDef of type "uniqueValueDev"', (t) => {
  t.plan(1);
  const normalized = normalizeClassification({
    classificationDef: {
      type: 'uniqueValueDef',
      uniqueValueFields: ['abc', 'def'],
    },
  });
  t.deepEquals(normalized, {
    type: 'unique',
    fields: ['abc', 'def'],
  });
});
