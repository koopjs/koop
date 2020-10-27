const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const modulePath = '../../../../lib/filter-and-transform/helpers/create-integer-hash'
test('numeric hash 32 function', t => {
  const hashFunctionSpy = sinon.spy(function () {
    return 4294967295
  })
  const createIntegerHash = proxyquire(modulePath, {
    './hash-function': hashFunctionSpy
  })

  const result = createIntegerHash('my-string')
  t.equals(result, 2147483647)
  t.ok(hashFunctionSpy.calledOnce)
  t.deepEquals(hashFunctionSpy.firstCall.args, ['my-string'])
  t.end()
})
