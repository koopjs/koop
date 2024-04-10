const _ = require('lodash');
const test = require('tape');
const winnow = require('../..');
const treesSubset = require('./fixtures/trees.json');
const classBreaks = require('./fixtures/classification/classBreaks.json');
const uniqueValue = require('./fixtures/classification/uniqueValue.json');
const multipleUnique = require('./fixtures/classification/multipleUnqiue.json');
const geoServicesClassBreaks = require('./fixtures/classification/geoServicesClassBreaks.json');
const geoServicesUniqueValue = require('./fixtures/classification/geoServicesUniqueValue.json');

/* class breaks */
test('create class breaks', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [0, 1.8571428571428572]);
  t.deepEqual(results[6], [11.142857142857146, 13]);
  t.end();
});

test('create class breaks without where clause', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  delete options.where;
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [0, 3.857142857142857]);
  t.deepEqual(results[6], [23.142857142857142, 27]);
  t.end();
});

test('change class break count', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.breakCount = 9;
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 9);
  t.deepEqual(results[0], [0, 1.4444444444444444]);
  t.deepEqual(results[8], [11.555555555555557, 13]);
  t.end();
});

test('change classification field', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.field = 'House_Number';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [505, 745.7142857142858]);
  t.deepEqual(results[6], [1949.2857142857147, 2190]);
  t.end();
});

test('classify using natural breaks', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.method = 'naturalBreaks';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [0, 0]);
  t.deepEqual(results[6], [13, 13]);
});

test('classify using quantile', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.method = 'quantile';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [0, 1]);
  t.deepEqual(results[6], [13, 13]);
});

test('classify using standard deviation', (t) => {
  t.plan(6);
  const options = _.cloneDeep(classBreaks);
  options.classification.method = 'stddev';
  options.classification.stddev_intv = 1;
  // options.classification.breakCount = 2
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 15);
  t.deepEqual(results[0], [-27.007608, -22.523262]);
  t.deepEqual(results[7], [4.382826, 8.867174]);
  t.deepEqual(results[14], [35.773262, 40.257608]);
});

test('normalize by field', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.field = 'House_Number';
  options.classification.normType = 'field';
  options.classification.normField = 'Trunk_Diameter';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [38.84615384615385, 137.1062271062271]);
  t.deepEqual(results[6], [628.4065934065934, 726.6666666666666]);
});

test('normalize by log', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.normType = 'log';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [0, 0.15913476461526238]);
  t.deepEqual(results[6], [0.9548085876915742, 1.1139433523068367]);
});

test('normalize by total', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  options.classification.normType = 'percent';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [0, 1.752021563342318]);
  t.deepEqual(results[6], [10.51212938005391, 12.264150943396226]);
});

test('unrecognized classification field', (t) => {
  t.plan(1);
  const options = _.cloneDeep(classBreaks);
  options.classification.field = 'UNRECOGNIZED_FIELD';
  t.throws(function () {
    winnow.query(treesSubset, options);
  });
});

test('unacceptable classification field', (t) => {
  t.plan(1);
  const options = _.cloneDeep(classBreaks);
  options.classification.field = 'Common_Name';
  t.throws(function () {
    winnow.query(treesSubset, options);
  });
});

test('unacceptable classification method', (t) => {
  t.plan(1);
  const options = _.cloneDeep(classBreaks);
  options.classification.method = 'invalidMethod';
  t.throws(function () {
    winnow.query(treesSubset, options);
  });
});

test('handle unacceptable field with different value types', (t) => {
  t.plan(1);
  const options = _.cloneDeep(classBreaks);
  options.where = 'House_Number>200';
  const data = _.cloneDeep(treesSubset);
  data.features[2].properties.Trunk_Diameter = 'Invalid Value';
  t.throws(function () {
    winnow.query(data, options);
  });
});

test('remove null values during classification', (t) => {
  t.plan(5);
  const options = _.cloneDeep(classBreaks);
  const data = _.cloneDeep(treesSubset);
  data.features[0].properties.Trunk_Diameter = null;
  data.features[17].properties.Trunk_Diameter = null;
  data.features[18].properties.Trunk_Diameter = null;
  data.features[21].properties.Trunk_Diameter = null;
  const results = winnow.query(data, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], [1, 2.571428571428571]);
  t.deepEqual(results[6], [10.428571428571427, 12]);
  t.end();
});

/* unique values */
test('create unique values', (t) => {
  t.plan(5);
  const options = _.cloneDeep(uniqueValue);
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(typeof results === 'object', true);
  t.equal(results.length, 6);
  t.deepEqual(results[0], { Genus: 'MAGNOLIA', count: 3 });
  t.deepEqual(results[5], { Genus: 'MELALEUCA', count: 1 });
  t.end();
});

test('add unique values', (t) => {
  t.plan(6);
  const options = _.cloneDeep(uniqueValue);
  const ammendedtrees = _.cloneDeep(treesSubset);
  ammendedtrees.features.push(
    {
      type: 'Feature',
      properties: {
        OBJECTID: 99998,
        Common_Name: 'SOUTHERN MAGNOLIA',
        Genus: 'MAGNOLIA',
        Trunk_Diameter: 10,
      },
    },
    {
      type: 'Feature',
      properties: {
        OBJECTID: 99999,
        Common_Name: 'SOUTHERN NEW_GENUS',
        Genus: 'NEW_GENUS',
        Trunk_Diameter: 11,
      },
    },
  );
  const results = winnow.query(ammendedtrees, options);
  t.equal(Array.isArray(results), true);
  t.equal(typeof results === 'object', true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], { Genus: 'MAGNOLIA', count: 4 });
  t.deepEqual(results[5], { Genus: 'MELALEUCA', count: 1 });
  t.deepEqual(results[6], { Genus: 'NEW_GENUS', count: 1 });
  t.end();
});

test('change unique value field', (t) => {
  t.plan(5);
  const options = _.cloneDeep(uniqueValue);
  options.classification.fields[0] = 'Common_Name';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(typeof results === 'object', true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], { Common_Name: 'SOUTHERN MAGNOLIA', count: 3 });
  t.deepEqual(results[6], { Common_Name: 'FLAX-LEAF PAPERBARK', count: 1 });
  t.end();
});

test('create unique values with multiple unique fields', (t) => {
  t.plan(6);
  const options = {
    classification: {
      type: 'unique',
      fields: ['EmployeeID', 'ShipperID'],
      fieldDelimiter: ', ',
    },
    where: 'OBJECTID<11310',
    f: 'pjson',
  };
  const results = winnow.query(multipleUnique, options);
  t.equal(Array.isArray(results), true);
  t.equal(typeof results === 'object', true);
  t.equal(results.length, 6);
  t.deepEqual(results[0], { count: 1, EmployeeID: 'John', ShipperID: 'Marc' });
  t.deepEqual(results[3], {
    count: 2,
    EmployeeID: 'Leeroy',
    ShipperID: 'Marc',
  });
  t.deepEqual(results[5], {
    count: 1,
    EmployeeID: 'Leeroy',
    ShipperID: 'Eric',
  });
  t.end();
});

test('cannot create unique values with more than three fields', (t) => {
  t.plan(1);
  const options = {
    classification: {
      type: 'unique',
      fields: ['EmployeeID', 'ShipperID', 'Department', 'Date'],
      fieldDelimiter: ', ',
    },
    where: 'OBJECTID<11310',
    f: 'pjson',
  };
  t.throws(function () {
    winnow.query(treesSubset, options);
  });
});

test('unacceptable classification field', (t) => {
  t.plan(1);
  const options = _.cloneDeep(uniqueValue);
  options.classification.fields[0] = 'Unacceptable Field';
  t.throws(function () {
    winnow.query(multipleUnique, options);
  });
});

/* geoservices fixtures */
test('create class breaks using geoservices fixture', (t) => {
  t.plan(5);
  const options = _.cloneDeep(geoServicesClassBreaks);
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 5);
  t.deepEqual(results[0], [0, 2.6]);
  t.deepEqual(results[4], [10.5, 13]);
  t.end();
});

test('modify class breaks using geoservices fixture', (t) => {
  const options = _.cloneDeep(geoServicesClassBreaks);
  options.classificationDef.classificationMethod = 'esriClassifyNaturalBreaks';
  options.classificationDef.breakCount = 9;
  options.classificationDef.normalizationType = 'esriNormalizeByLog';
  options.where = 'Trunk_Diameter>3';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(Array.isArray(results[0]), true);
  t.equal(results.length, 9);
  t.deepEqual(results[0], [0.6020599913279624, 0.8450980400142568]);
  t.deepEqual(results[4], [0.9542425094393249, 1.1139433523068367]);
  t.end();
});

test('create unique values using geoservices fixture', (t) => {
  t.plan(5);
  const options = _.cloneDeep(geoServicesUniqueValue);
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(typeof results === 'object', true);
  t.equal(results.length, 6);
  t.deepEqual(results[0], { Genus: 'MAGNOLIA', count: 3 });
  t.deepEqual(results[5], { Genus: 'MELALEUCA', count: 1 });
  t.end();
});

test('modify unique values using geoservices fixture', (t) => {
  t.plan(5);
  const options = _.cloneDeep(geoServicesUniqueValue);
  options.classificationDef.uniqueValueFields[0] = 'Common_Name';
  const results = winnow.query(treesSubset, options);
  t.equal(Array.isArray(results), true);
  t.equal(typeof results === 'object', true);
  t.equal(results.length, 7);
  t.deepEqual(results[0], { Common_Name: 'SOUTHERN MAGNOLIA', count: 3 });
  t.deepEqual(results[6], { Common_Name: 'FLAX-LEAF PAPERBARK', count: 1 });
  t.end();
});
