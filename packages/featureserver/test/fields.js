const createFields = require('../src/fields')

describe('when building esri fields', function () {
  var input = {
    propInt: 10,
    propFloat: 10.1,
    propString: 'Awesome',
    propDate: '2015-06-22T13:17:21+0000'
  }
  var fieldObj = createFields(input)
  var fields = fieldObj.fields

  it('fields should be an array', (done) => {
    fieldObj.should.be.an.instanceOf(Object)
    fields.should.be.an.instanceOf(Array)
    done()
  })

  it('IOD field should equal OBJECTID', (done) => {
    fieldObj.oidField.should.equal('OBJECTID')
    done()
  })

  it('attributes should contain a double, int, and string', (done) => {
    fields.forEach(function (f) {
      f.should.have.property('type')
      f.should.have.property('name')
      f.should.have.property('alias')
    })
    fields[0].type.should.equal('esriFieldTypeInteger')
    fields[1].type.should.equal('esriFieldTypeDouble')
    fields[2].type.should.equal('esriFieldTypeString')
    fields[3].type.should.equal('esriFieldTypeDate')
    done()
  })

  describe('proper dates get through, improper dates fail', () => {
    const input = {
      properDate: '2015-06-22T13:17:21+0000',
      improperDate1: 'Thisisafaildate 1',
      improperDate2: '06/22/2015'
    }
    const fieldObj = createFields(input)
    const fields = fieldObj.fields

    it('Should not allow improper date formats through', (done) => {
      fields[0].type.should.equal('esriFieldTypeDate')
      fields[1].type.should.equal('esriFieldTypeString')
      fields[2].type.should.equal('esriFieldTypeString')
      done()
    })
  })

})
