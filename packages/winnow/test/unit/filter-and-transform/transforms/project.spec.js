const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const project = require('../../../../lib/filter-and-transform/transforms/project')
const modulePath = '../../../../lib/filter-and-transform/transforms/project'
process.env.KOOP_WARNINGS = 'suppress'

test('project, empty input, returns undefined', t => {
  const result = project()
  t.equals(result, undefined)
  t.end()
})

test('project, empty target coordinate system input, returns input geometry', t => {
  const result = project({})
  t.deepEquals(result, {})
  t.end()
})

test('project, empty geometry object, return input geometry', t => {
  const result = project({}, 'coordinate-system')
  t.deepEquals(result, {})
  t.end()
})

test('project, missing input geometry coordinates, return input geometry', t => {
  const result = project({ type: 'Point' }, 'coordinate-system')
  t.deepEquals(result, { type: 'Point' })
  t.end()
})

test('project, missing input geometry type, return input geometry', t => {
  const result = project({ coordinates: [] }, 'coordinate-system')
  t.deepEquals(result, { coordinates: [] })
  t.end()
})

test('project, valid input, return projection result', t => {
  const projectSpy = sinon.spy(function () { return 'projected-coordinates' })
  const project = proxyquire(modulePath, {
    '../../helpers/project-coordinates': projectSpy
  })
  const result = project({ type: 'Point', coordinates: 'source-coordinates' }, 'source-cs', 'target-cs')
  t.deepEquals(result, { type: 'Point', coordinates: 'projected-coordinates' })
  t.ok(projectSpy.calledOnce)
  t.deepEquals(projectSpy.firstCall.args, [{
    coordinates: 'source-coordinates',
    fromSR: 'source-cs',
    toSR: 'target-cs'
  }])
  t.end()
})

test('project, error throw in projection, return null', t => {
  const projectSpy = sinon.spy(function () {
    throw new Error('project error')
  })
  const project = proxyquire(modulePath, {
    '../../helpers/project-coordinates': projectSpy
  })
  const result = project({ type: 'Point', coordinates: [] }, 'source-cs', 'target-cs')
  t.deepEquals(result, null)
  t.end()
})
