const should = require('should') // eslint-disable-line
const {
  getDataTypeFromValue,
  isDate
} = require('../../../lib/helpers/data-type-utils')

describe('getDataTypeFromValue', () => {
  it('should return integer', () => {
    getDataTypeFromValue(10).should.equal('Integer')
  })

  it('should return double', () => {
    getDataTypeFromValue(10.10).should.equal('Double')
  })

  it('should return string', () => {
    getDataTypeFromValue('10.10').should.equal('String')
  })

  it('should return string as default', () => {
    getDataTypeFromValue().should.equal('String')
  })

  it('should return date for date object', () => {
    getDataTypeFromValue(new Date()).should.equal('Date')
  })

  it('should return date for data ISO string', () => {
    getDataTypeFromValue(new Date().toISOString()).should.equal('Date')
  })
})

describe('isDate', () => {
  it('should return true for date object', () => {
    isDate(new Date()).should.equal(true)
  })

  it('should return true for ISO string', () => {
    getDataTypeFromValue(new Date().toISOString()).should.equal('Date')
  })

  it('should return false for number', () => {
    isDate(1000).should.equal(false)
  })
})
