const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../../lib/filter-and-transform/prepare-filter-and-transform'

test('Should return prepared filter and transform query', t => {
  const compiledQuerySpy = sinon.spy((params) => {
    return 'results'
  })

  const filterAndTransform = sinon.spy({
    compile: function () {
      return compiledQuerySpy
    }
  })

  const prepareFilterAndTransform = proxyquire(modulePath, {
    './filter-and-transform': filterAndTransform
  })

  // Get a prepared filter and transform query
  const preparedFilterAndTransform = prepareFilterAndTransform('SELECT foo FROM ?')
  t.equals(typeof preparedFilterAndTransform, 'function')

  // Execute with single GeoJSON feature
  const result1 = preparedFilterAndTransform({ type: 'feature' })
  t.equals(result1, 'results')
  t.deepEquals(compiledQuerySpy.firstCall.args, [[[{ type: 'feature' }]]])

  // Execute with single Esri feature
  const result2 = preparedFilterAndTransform({ attributes: {} })
  t.equals(result2, 'results')
  t.deepEquals(compiledQuerySpy.secondCall.args, [[[{ attributes: {} }]]])

  // Execute with GeoJSON feature array
  const result3 = preparedFilterAndTransform([{ type: 'feature' }])
  t.equals(result3, 'results')
  t.deepEquals(compiledQuerySpy.thirdCall.args, [[[{ type: 'feature' }]]])
  t.end()
})
