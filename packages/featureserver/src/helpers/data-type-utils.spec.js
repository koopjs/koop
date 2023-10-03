const should = require('should') // eslint-disable-line
const {
  getDataTypeFromValue,
  isDate
} = require('./data-type-utils');

describe('getDataTypeFromValue', () => {
  it('should return integer', () => {
    getDataTypeFromValue(10).should.equal('Integer');
  });

  it('should return double', () => {
    getDataTypeFromValue(10.10).should.equal('Double');
  });

  it('should return string', () => {
    getDataTypeFromValue('10.10').should.equal('String');
  });

  it('should return string as default', () => {
    getDataTypeFromValue().should.equal('String');
  });

  it('should return date for date object', () => {
    getDataTypeFromValue(new Date()).should.equal('Date');
  });

  it('should return date for data ISO string', () => {
    getDataTypeFromValue(new Date().toISOString()).should.equal('Date');
  });
});

describe('isDate', () => {
  it('should return true for date object', () => {
    isDate(new Date()).should.equal(true);
  });

  it('should return true for ISO string', () => {
    isDate(new Date().toISOString()).should.equal(true);
  });

  it('should return true for SQL Date', () => {
    isDate('2020-10-01').should.equal(true);
  });

  it('should return true for SQL Datetime', () => {
    isDate('2020-10-01 10:31:45.000').should.equal(true);
  });

  it('should return false for YYYY/MM/DD', () => {
    isDate('2020/10/01').should.equal(false);
  });

  it('should return false for number', () => {
    isDate(1000).should.equal(false);
  });

  it('should return false for a string', () => {
    isDate('foo').should.equal(false);
  });

  it('should return false for a string in parenthesis', () => {
    isDate('(foo').should.equal(false);
  });
});
