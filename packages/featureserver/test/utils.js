const { detectType, esriTypeMap } = require('../src/utils')

describe('Detect Types', () => {
  describe('detectType', () => {
    it('should return correct string representation of a values data type', () => {
      detectType(1).should.equal('Integer')
      detectType(100.1).should.equal('Double')
      detectType('test').should.equal('String')
      detectType(new Date()).should.equal('Date')
      detectType(new Date().toISOString()).should.equal('Date')
    })
  })

  describe('esriTypeMap', () => {
    it('should return correct string representation of a values data type', () => {
      esriTypeMap('Integer').should.equal('esriFieldTypeInteger')
      esriTypeMap('Double').should.equal('esriFieldTypeDouble')
      esriTypeMap('String').should.equal('esriFieldTypeString')
      esriTypeMap('Date').should.equal('esriFieldTypeDate')
      esriTypeMap('Blob').should.equal('esriFieldTypeBlob')
      esriTypeMap('Geometry').should.equal('esriFieldTypeGeometry')
      esriTypeMap('GlobalID').should.equal('esriFieldTypeGlobalID')
      esriTypeMap('GUID').should.equal('esriFieldTypeGUID')
      esriTypeMap('Raster').should.equal('esriFieldTypeRaster')
      esriTypeMap('Single').should.equal('esriFieldTypeSingle')
      esriTypeMap('SmallInteger').should.equal('esriFieldTypeSmallInteger')
      esriTypeMap('XML').should.equal('esriFieldTypeXML')
    })
  })
})
