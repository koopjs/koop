const should = require('should') // eslint-disable-line
const {
  getEsriTypeFromDefinition,
  getEsriTypeFromValue
} = require('../../../../lib/helpers/fields/esri-type-utils')

describe('getEsriTypeFromDefinition', () => {
  it('no definition should default to string', () => {
    const result = getEsriTypeFromDefinition()
    result.should.equal('esriFieldTypeString')
  })

  it('string', () => {
    getEsriTypeFromDefinition('String').should.equal('esriFieldTypeString')
    getEsriTypeFromDefinition('string').should.equal('esriFieldTypeString')
  })

  it('double', () => {
    getEsriTypeFromDefinition('Double').should.equal('esriFieldTypeDouble')
    getEsriTypeFromDefinition('double').should.equal('esriFieldTypeDouble')
  })

  it('integer', () => {
    getEsriTypeFromDefinition('Integer').should.equal('esriFieldTypeInteger')
    getEsriTypeFromDefinition('integer').should.equal('esriFieldTypeInteger')
  })

  it('date', () => {
    getEsriTypeFromDefinition('Date').should.equal('esriFieldTypeDate')
    getEsriTypeFromDefinition('date').should.equal('esriFieldTypeDate')
  })

  it('blob', () => {
    getEsriTypeFromDefinition('Blob').should.equal('esriFieldTypeBlob')
    getEsriTypeFromDefinition('blob').should.equal('esriFieldTypeBlob')
  })

  it('geometry', () => {
    getEsriTypeFromDefinition('Geometry').should.equal('esriFieldTypeGeometry')
    getEsriTypeFromDefinition('geometry').should.equal('esriFieldTypeGeometry')
  })

  it('globalid', () => {
    getEsriTypeFromDefinition('GlobalID').should.equal('esriFieldTypeGlobalID')
    getEsriTypeFromDefinition('globalid').should.equal('esriFieldTypeGlobalID')
  })

  it('guid', () => {
    getEsriTypeFromDefinition('GUID').should.equal('esriFieldTypeGUID')
    getEsriTypeFromDefinition('guid').should.equal('esriFieldTypeGUID')
  })

  it('raster', () => {
    getEsriTypeFromDefinition('Raster').should.equal('esriFieldTypeRaster')
    getEsriTypeFromDefinition('raster').should.equal('esriFieldTypeRaster')
  })

  it('single', () => {
    getEsriTypeFromDefinition('Single').should.equal('esriFieldTypeSingle')
    getEsriTypeFromDefinition('single').should.equal('esriFieldTypeSingle')
  })

  it('small-integer', () => {
    getEsriTypeFromDefinition('SmallInteger').should.equal('esriFieldTypeSmallInteger')
    getEsriTypeFromDefinition('smallinteger').should.equal('esriFieldTypeSmallInteger')
  })

  it('xml', () => {
    getEsriTypeFromDefinition('XML').should.equal('esriFieldTypeXML')
    getEsriTypeFromDefinition('xml').should.equal('esriFieldTypeXML')
  })
})

describe('getEsriTypeFromValue', () => {
  it('no value should default to string', () => {
    const result = getEsriTypeFromValue()
    result.should.equal('esriFieldTypeString')
  })

  it('string', () => {
    getEsriTypeFromValue('some-string').should.equal('esriFieldTypeString')
  })

  it('double', () => {
    getEsriTypeFromValue(3.145678).should.equal('esriFieldTypeDouble')
  })

  it('integer', () => {
    getEsriTypeFromValue(2).should.equal('esriFieldTypeInteger')
  })

  it('date', () => {
    getEsriTypeFromValue(new Date()).should.equal('esriFieldTypeDate')
    getEsriTypeFromValue((new Date()).toISOString()).should.equal('esriFieldTypeDate')
  })
})
