/* global describe, it */
const field = require('../src/field')

describe('when building esri fields', function () {
  var input = {
    propInt: 10,
    propFloat: 10.1,
    propString: 'Awesome',
    propDate: '2015-06-22T13:17:21+0000'
  }
  var fieldObj = field.fields(input)
  var fields = fieldObj.fields

  it('fields should be an array', () => {
    fieldObj.should.be.an.instanceOf(Object)
    fields.should.be.an.instanceOf(Array)
  })

  it('IOD field should equal OBJECTID', () => {
    fieldObj.oidField.should.equal('OBJECTID')
  })

  it('attributes should contain a double, int, and string', () => {
    fields.forEach(function (f) {
      f.should.have.property('type')
      f.should.have.property('name')
      f.should.have.property('alias')
    })
    fields[0].type.should.equal('esriFieldTypeInteger')
    fields[1].type.should.equal('esriFieldTypeDouble')
    fields[2].type.should.equal('esriFieldTypeString')
    fields[3].type.should.equal('esriFieldTypeDate')
  })

  describe('proper dates get through, improper dates fail', () => {
    const input = {
      properDate: '2015-06-22T13:17:21+0000',
      improperDate1: 'Thisisafaildate 1',
      improperDate2: '06/22/2015'
    }
    const fieldObj = field.fields(input)
    const fields = fieldObj.fields

    it('Should not allow improper date formats through', () => {
      fields[0].type.should.equal('esriFieldTypeDate')
      fields[1].type.should.equal('esriFieldTypeString')
      fields[2].type.should.equal('esriFieldTypeString')
    })
  })
})
