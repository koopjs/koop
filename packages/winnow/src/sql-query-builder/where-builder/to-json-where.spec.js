/* eslint-disable quotes */
const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const translateSqlWhere = require('./to-json-where');

test('toJsonWhere: transform a simple equality predicate', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere("foo='bar'");
  t.equals(whereFragment, "properties->`foo` = 'bar'");
});

test('toJsonWhere: transform a simple but inverse predicate', (t) => {
  t.plan(1);
  const whereFragment = translateSqlWhere("'bar'=foo");
  t.equals(whereFragment, "'bar' = properties->`foo`");
});

test('toJsonWhere: handle LIKE', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere("foo LIKE '%bar%'");
  t.equals(whereFragment, "properties->`foo` LIKE '%bar%'");
});

test('toJsonWhere: transform a simple predicate to a form required for Esri JSON', (t) => {
  t.plan(1);
  const options = {
    esri: true,
  };
  const whereFragment = translateSqlWhere("foo='bar'", options);
  t.equals(whereFragment, "attributes->`foo` = 'bar'");
});

test('toJsonWhere: transform a simple but inverse predicate to Esri flavor', (t) => {
  t.plan(1);
  const options = {
    esri: true,
  };

  const whereFragment = translateSqlWhere("'bar'=foo", options);
  t.equals(whereFragment, "'bar' = attributes->`foo`");
});

test('toJsonWhere: transform a predicate with OBJECTID and metadata fields that define the OBJECTID', (t) => {
  t.plan(1);
  const options = {
    idField: 'OBJECTID',
    collection: {
      metadata: {
        fields: [{ name: 'OBJECTID' }],
      },
    },
  };

  const whereFragment = translateSqlWhere('OBJECTID=1234', options);
  t.equals(whereFragment, 'properties->`OBJECTID` = 1234');
});

test('toJsonWhere: handles 1=1', (t) => {
  t.plan(1);
  const whereFragment = translateSqlWhere('1=1');
  t.equals(whereFragment, '1 = 1');
});

test('toJsonWhere: handles (expression))', (t) => {
  t.plan(1);
  const whereFragment = translateSqlWhere(
    "(model = 'ford' OR model = 'benz') AND color = 'white'",
  );
  t.equals(
    whereFragment,
    "(properties->`model` = 'ford' OR properties->`model` = 'benz') AND properties->`color` = 'white'",
  );
});

test('toJsonWhere: handle unary', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('-foo < 0');
  t.equals(whereFragment, '- properties->`foo` < 0');
});

test('toJsonWhere: handle function call', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere("now() = 'test'");
  t.equals(whereFragment, "now() = 'test'");
});

test('toJsonWhere: handle IN list', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('foo IN (1,2,3)');
  t.equals(whereFragment, 'properties->`foo` IN (1, 2, 3 )');
});

test('toJsonWhere: handle IS NULL', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('foo IS NULL');
  t.equals(whereFragment, 'properties->`foo` IS NULL');
});

test('toJsonWhere: handle IS NOT NULL', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('foo IS NOT NULL');
  t.equals(whereFragment, 'properties->`foo` IS NOT NULL');
});

test('toJsonWhere: handle boolean', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('foo = TRUE');
  t.equals(whereFragment, 'properties->`foo` = TRUE');
});

test('toJsonWhere: handle mixed case', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('fOOoo IS NULL');
  t.equals(whereFragment, 'properties->`fOOoo` IS NULL');
});

test('toJsonWhere: handles double quoted column', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere('"fOOoo" IS NULL');
  t.equals(whereFragment, 'properties->`fOOoo` IS NULL');
});

test('toJsonWhere: handle BETWEEN', (t) => {
  t.plan(1);

  const whereFragment = translateSqlWhere(
    "the_date BETWEEN '2015-01-01T00:00:00.000Z' AND '2019-01-01T00:00:00.000Z'",
  );
  t.equals(
    whereFragment,
    "properties->`the_date` BETWEEN '2015-01-01T00:00:00.000Z' AND '2019-01-01T00:00:00.000Z'",
  );
});

test('toJsonWhere: transform a simple equality predicate and transform values by code value domain', (t) => {
  t.plan(1);
  const options = {
    esriFields: [
      {
        name: 'State',
        domain: {
          type: 'codedValue',
          name: 'State',
          codedValues: [
            {
              name: 'Virginia',
              code: '1',
            },
            {
              name: 'Maryland',
              code: '2',
            },
          ],
        },
      },
    ],
  };
  const whereFragment = translateSqlWhere("State = '1'", options);
  t.equals(whereFragment, "properties->`State` = 'Virginia'");
});

test('toJsonWhere: transform a IN list and transform values by code value domain', (t) => {
  t.plan(1);
  const options = {
    esriFields: [
      {
        name: 'State',
        domain: {
          type: 'codedValue',
          name: 'State',
          codedValues: [
            {
              name: 'Virginia',
              code: '1',
            },
            {
              name: 'Maryland',
              code: '2',
            },
          ],
        },
      },
    ],
  };
  const whereFragment = translateSqlWhere("State IN ('1', '2')", options);
  t.equals(whereFragment, "properties->`State` IN ('Virginia', 'Maryland' )");
});

test('toJsonWhere: handle error', (t) => {
  t.plan(1);

  try {
    translateSqlWhere('"foo"" = 1');
    t.fail('should have thrown');
  } catch (error) {
    t.equals(error.message, 'Invalid "where" parameter: "foo"" = 1');
  }
});
