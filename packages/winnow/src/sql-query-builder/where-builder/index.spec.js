const test = require('tape');
const WhereBuilder = require('.');

test('WhereBuilder.create: returns empty string if no options', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create();
  t.equals(whereClause, undefined);
});

test('WhereBuilder.create: returns empty string if empty options', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({});
  t.equals(whereClause, undefined);
});

test('WhereBuilder.create: where param', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({
    where: "color='red'",
  });
  t.equals(whereClause, "properties->`color` = 'red'");
});

test('WhereBuilder.create: objectIds param, numeric', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({
    objectIds: [1, 2],
    idField: 'OBJECTID',
  });
  t.equals(whereClause, 'properties->`OBJECTID` IN (1, 2 )');
});

test('WhereBuilder.create: objectIds param, string', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({
    objectIds: ['abc', 'xyz'],
    idField: 'OBJECTID',
  });
  t.equals(whereClause, "properties->`OBJECTID` IN ('abc', 'xyz' )");
});

test('WhereBuilder.create: where param and objectIds param', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({
    where: "color='red'",
    objectIds: [1, 2],
    idField: 'OBJECTID',
  });
  t.equals(whereClause, "properties->`color` = 'red' AND properties->`OBJECTID` IN (1, 2 )");
});

test('WhereBuilder.create: returns where clause with geometry predicate', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({
    geometry: [0, 0, 0, 0],
  });
  t.equals(whereClause, 'ST_Intersects(?, geometry)');
});

test('returns where clause with translated sql-where and geometry predicate', (t) => {
  t.plan(1);
  const whereClause = WhereBuilder.create({
    geometry: [0, 0, 0, 0],
    where: "color='red'",
  });
  t.equals(whereClause, "properties->`color` = 'red' AND ST_Intersects(?, geometry)");
});

test('predicate with OBJECTID and no metadata fields to user-defined function', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({ where: 'OBJECTID=1234' });
  t.equals(whereClause, "hashedObjectIdComparator(properties, geometry, 1234, '=')=true");
});

test('WhereBuilder.create: transform a predicate with OBJECTID IN (1234)', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({ objectIds: [1234, 4567] });
  t.equals(whereClause, "hashedObjectIdComparator(properties, geometry, '1234,4567', 'IN')=true");
});

test('predicate with OBJECTID and no metadata fields to Esri with user-defined function', (t) => {
  t.plan(1);
  const options = {
    esri: true,
    where: 'OBJECTID=1234',
  };

  const whereClause = WhereBuilder.create(options);
  t.equals(whereClause, "hashedObjectIdComparator(attributes, geometry, 1234, '=')=true");
});

test('inverse predicate with OBJECTID and no fields toEsri with user function', (t) => {
  t.plan(1);
  const options = {
    esri: true,
    where: '1234>OBJECTID',
  };

  const whereClause = WhereBuilder.create(options);
  t.equals(whereClause, "hashedObjectIdComparator(attributes, geometry, 1234, '<=')=true");
});

test('WhereBuilder.create: handle BETWEEN', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({
    where: "the_date BETWEEN DATE '2015-01-01' AND DATE '2019-01-01'",
  });
  t.equals(
    whereClause,
    "properties->`the_date` BETWEEN '2015-01-01T00:00:00.000Z' AND '2019-01-01T00:00:00.000Z'",
  );
});

test('WhereBuilder.create: handle mixed-case DATE cast', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({ where: "foo > Date '2012-02-01'" });
  t.equals(whereClause, "properties->`foo` > '2012-02-01T00:00:00.000Z'");
});

test('WhereBuilder.create: handle escaped single quotes', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({
    where: "Street_Name = 'GRAND''S STREET''S'",
  });
  t.equals(whereClause, "properties->`Street_Name` = 'GRAND\\'S STREET\\'S'");
});

test('WhereBuilder.create: handle TIMESTAMP cast', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({
    where: "foo > TIMESTAMP '2012-02-01 12:15'",
  });
  t.equals(whereClause, "properties->`foo` > '2012-02-01T12:15:00.000Z'");
});

test('WhereBuilder.create: handle DATE cast', (t) => {
  t.plan(1);

  const whereClause = WhereBuilder.create({ where: "foo > DATE '2012-02-01'" });
  t.equals(whereClause, "properties->`foo` > '2012-02-01T00:00:00.000Z'");
});

test('WhereBuilder.create: handle TIMESTAMP cast error', (t) => {
  t.plan(1);

  try {
    WhereBuilder.create({ where: "foo > TIMESTAMP 'barz'" });
    t.fail('should have thrown');
  } catch (error) {
    t.equals(error.message, 'Invalid "where" parameter: Invalid time value for timestamp "barz"');
  }
});
