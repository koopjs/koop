/* global describe, it */
const should = require('should'); // eslint-disable-line
const {
  createSymbol
} = require('../../../lib/generate-renderer/create-symbol')

describe('when creating a symbol', () => {
  it('uses passed in base symbol and color', () => {
    const result = createSymbol({ foo: 'bar' }, 'red')
    result.should.deepEqual({ foo: 'bar', color: 'red' })
  })

  it('errors without base symbol or geometry type', () => {
    try {
      createSymbol(undefined, 'red')
      should.fail('should have thrown error')
    } catch (error) {
      error.message.should.equal('Dataset geometry type is not supported for renderers.')
      error.code.should.equal(400)
    }
  })

  it('gets symbol from point renderer', () => {
    const result = createSymbol(undefined, 'red', 'esriGeometryPoint')
    result.should.deepEqual({
      color: 'red',
      outline: {
        color: [
          190,
          190,
          190,
          105
        ],
        width: 0.5,
        type: 'esriSLS',
        style: 'esriSLSSolid'
      },
      size: 7.5,
      type: 'esriSMS',
      style: 'esriSMSCircle'
    })
  })

  it('gets symbol from point renderer', () => {
    const result = createSymbol(undefined, 'red', 'esriGeometryMultiPoint')
    result.should.deepEqual({
      color: 'red',
      outline: {
        color: [
          190,
          190,
          190,
          105
        ],
        width: 0.5,
        type: 'esriSLS',
        style: 'esriSLSSolid'
      },
      size: 7.5,
      type: 'esriSMS',
      style: 'esriSMSCircle'
    })
  })

  it('gets symbol from line renderer', () => {
    const result = createSymbol(undefined, 'red', 'esriGeometryPolyline')
    result.should.deepEqual({
      color: 'red',
      width: 6.999999999999999,
      type: 'esriSLS',
      style: 'esriSLSSolid'
    })
  })

  it('gets symbol from polygon renderer', () => {
    const result = createSymbol(undefined, 'red', 'esriGeometryPolygon')
    result.should.deepEqual({
      color: 'red',
      outline: {
        color: [
          150,
          150,
          150,
          155
        ],
        width: 0.5,
        type: 'esriSLS',
        style: 'esriSLSSolid'
      },
      type: 'esriSFS',
      style: 'esriSFSSolid'
    })
  })
})
