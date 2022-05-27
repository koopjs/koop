const should = require('should') // eslint-disable-line
const {
  ESRI_FIELD_TYPE_OID,
  ESRI_FIELD_TYPE_STRING,
  ESRI_FIELD_TYPE_DATE,
  ESRI_FIELD_TYPE_DOUBLE,
  SQL_TYPE_INTEGER,
  SQL_TYPE_OTHER,
  SQL_TYPE_FLOAT,
  OBJECTID_DEFAULT_KEY
} = require('../../../../lib/helpers/fields/constants')

describe('field constants', () => {
  it('ESRI_FIELD_TYPE_OID', () => {
    ESRI_FIELD_TYPE_OID.should.equal('esriFieldTypeOID')
  })

  it('ESRI_FIELD_TYPE_STRING', () => {
    ESRI_FIELD_TYPE_STRING.should.equal('esriFieldTypeString')
  })

  it('ESRI_FIELD_TYPE_DATE', () => {
    ESRI_FIELD_TYPE_DATE.should.equal('esriFieldTypeDate')
  })

  it('ESRI_FIELD_TYPE_DOUBLE', () => {
    ESRI_FIELD_TYPE_DOUBLE.should.equal('esriFieldTypeDouble')
  })

  it('SQL_TYPE_INTEGER', () => {
    SQL_TYPE_INTEGER.should.equal('sqlTypeInteger')
  })

  it('SQL_TYPE_OTHER', () => {
    SQL_TYPE_OTHER.should.equal('sqlTypeOther')
  })

  it('SQL_TYPE_FLOAT', () => {
    SQL_TYPE_FLOAT.should.equal('sqlTypeFloat')
  })

  it('OBJECTID_DEFAULT_KEY', () => {
    OBJECTID_DEFAULT_KEY.should.equal('OBJECTID')
  })
})
