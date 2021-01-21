const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../../lib/query/unique-value-query'
const uniqueValueQuery = require(modulePath)
test('uniqueValueQuery, too many fields', t => {
  t.plan(1)
  const features = [
    { properties: { Name: 'Oak', Trunk_Diameter: 13 } },
    { properties: { Name: 'Pine', Trunk_Diameter: 7 } },
    { properties: { Name: 'Oak', Trunk_Diameter: 17 } },
    { properties: { Name: 'Maple', Trunk_Diameter: 25 } },
    { properties: { Name: 'Maple', Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'unique',
    fields: ['Name', 'Location', 'Foo', 'Bar']
  }

  try {
    uniqueValueQuery(features, classification)
    t.fail('should have thrown')
  } catch (error) {
    t.equals(error.message, 'Cannot classify using more than three fields')
  }
})

test('uniqueValueQuery, unknown field', t => {
  t.plan(1)
  const features = [
    { properties: { Name: 'Oak', Trunk_Diameter: 13 } },
    { properties: { Name: 'Pine', Trunk_Diameter: 7 } },
    { properties: { Name: 'Oak', Trunk_Diameter: 17 } },
    { properties: { Name: 'Maple', Trunk_Diameter: 25 } },
    { properties: { Name: 'Maple', Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'unique',
    fields: ['Name', 'Location', 'Foo']
  }

  try {
    uniqueValueQuery(features, classification)
    t.fail('should have thrown')
  } catch (error) {
    t.equals(error.message, 'Unknown field: Location')
  }
})

test('uniqueValueQuery, one field', t => {
  t.plan(3)
  const standardQuerySpy = sinon.spy(function () {
    return 'standard query result for unique values'
  })
  const uniqueValueQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy
  })
  const features = [
    { properties: { Name: 'Oak', Trunk_Diameter: 13 } },
    { properties: { Name: 'Pine', Trunk_Diameter: 7 } },
    { properties: { Name: 'Oak', Trunk_Diameter: 17 } },
    { properties: { Name: 'Maple', Trunk_Diameter: 25 } },
    { properties: { Name: 'Maple', Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'unique',
    fields: ['Name']
  }

  const result = uniqueValueQuery(features, classification)
  t.equals(result, 'standard query result for unique values')
  t.equals(standardQuerySpy.callCount, 1)
  t.deepEquals(standardQuerySpy.firstCall.args, [
    [{
      properties: {
        Name: 'Oak',
        Trunk_Diameter: 13
      }
    }, {
      properties: {
        Name: 'Pine',
        Trunk_Diameter: 7
      }
    }, {
      properties: {
        Name: 'Oak',
        Trunk_Diameter: 17
      }
    }, {
      properties: {
        Name: 'Maple',
        Trunk_Diameter: 25
      }
    }, {
      properties: {
        Name: 'Maple',
        Trunk_Diameter: 3
      }
    }], 'SELECT COUNT(properties->`Name`) as `count`,  properties->`Name` as `Name` FROM ?  GROUP BY properties->`Name`', {
      aggregates: [{
        type: 'count',
        field: 'Name',
        name: 'count'
      }],
      groupBy: ['Name'],
      collection: undefined,
      idField: null,
      where: undefined,
      geometry: undefined,
      spatialPredicate: undefined,
      fields: undefined,
      order: undefined,
      limit: undefined,
      outputCrs: {
        wkid: 4326
      },
      inputCrs: {
        wkid: 4326
      },
      classification: undefined,
      offset: undefined,
      dateFields: [],
      skipLimitHandling: true
    }
  ])
})

test('uniqueValueQuery, two fields', t => {
  t.plan(3)
  const standardQuerySpy = sinon.spy(function () {
    return 'standard query result for unique values'
  })
  const uniqueValueQuery = proxyquire(modulePath, {
    './standard-query': standardQuerySpy
  })
  const features = [
    { properties: { Name: 'Oak', Location: 'Mill St', Trunk_Diameter: 13 } },
    { properties: { Name: 'Pine', Location: 'Mill St', Trunk_Diameter: 7 } },
    { properties: { Name: 'Oak', Location: 'Mill St', Trunk_Diameter: 17 } },
    { properties: { Name: 'Maple', Location: 'Wilson St', Trunk_Diameter: 25 } },
    { properties: { Name: 'Maple', Location: 'Wilson St', Trunk_Diameter: 3 } }
  ]
  const classification = {
    type: 'unique',
    fields: ['Name', 'Location']
  }

  const result = uniqueValueQuery(features, classification)
  t.equals(result, 'standard query result for unique values')
  t.equals(standardQuerySpy.callCount, 1)
  t.deepEquals(standardQuerySpy.firstCall.args, [
    [{
      properties: {
        Name: 'Oak',
        Location: 'Mill St',
        Trunk_Diameter: 13
      }
    }, {
      properties: {
        Name: 'Pine',
        Location: 'Mill St',
        Trunk_Diameter: 7
      }
    }, {
      properties: {
        Name: 'Oak',
        Location: 'Mill St',
        Trunk_Diameter: 17
      }
    }, {
      properties: {
        Name: 'Maple',
        Location: 'Wilson St',
        Trunk_Diameter: 25
      }
    }, {
      properties: {
        Name: 'Maple',
        Location: 'Wilson St',
        Trunk_Diameter: 3
      }
    }], 'SELECT COUNT(properties->`Name`) as `count`,  properties->`Name` as `Name`, properties->`Location` as `Location` FROM ?  GROUP BY properties->`Name`, properties->`Location`', {
      aggregates: [{
        type: 'count',
        field: 'Name',
        name: 'count'
      }],
      groupBy: ['Name', 'Location'],
      collection: undefined,
      idField: null,
      where: undefined,
      geometry: undefined,
      spatialPredicate: undefined,
      fields: undefined,
      order: undefined,
      limit: undefined,
      outputCrs: {
        wkid: 4326
      },
      inputCrs: {
        wkid: 4326
      },
      classification: undefined,
      offset: undefined,
      dateFields: [],
      skipLimitHandling: true
    }
  ])
})
