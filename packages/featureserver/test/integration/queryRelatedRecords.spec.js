/* global describe, it */
const should = require('should') // eslint-disable-line
const FeatureServer = require('../..')
const relatedData = require('./fixtures/relatedData.json')
const relatedDataCount = require('./fixtures/relatedDataCountProperty.json')

describe('QueryRelatedRecords operations', () => {
  it('should return the expected response schema for an optionless query', () => {
    const response = FeatureServer.queryRelatedRecords(relatedData, {})
    response.should.have.property('fields')
    response.should.have.property('relatedRecordGroups')
    response.fields.should.have.length(16)
    response.relatedRecordGroups.should.have.length(1)
    response.relatedRecordGroups[0].should.have.property('objectId', 261193)
    response.relatedRecordGroups[0].should.have.property('relatedRecords')
    response.relatedRecordGroups[0].relatedRecords.should.have.length(11)
  })

  it('should return count of features when returnCountOnly true in options', () => {
    const response = FeatureServer.queryRelatedRecords(relatedData, { returnCountOnly: true })
    response.should.not.have.property('fields')
    response.should.have.property('relatedRecordGroups')
    response.relatedRecordGroups.should.have.length(1)
    response.relatedRecordGroups[0].should.have.property('objectId', 261193)
    response.relatedRecordGroups[0].should.not.have.property('relatedRecords')
    response.relatedRecordGroups[0].should.have.property('count', 11)
  })

  it('should return count when specified in properties and returnCountOnly true in options', () => {
    const response = FeatureServer.queryRelatedRecords(relatedDataCount, { returnCountOnly: true })
    response.should.not.have.property('fields')
    response.should.have.property('relatedRecordGroups')
    response.relatedRecordGroups.should.have.length(1)
    response.relatedRecordGroups[0].should.have.property('objectId', 261193)
    response.relatedRecordGroups[0].should.not.have.property('relatedRecords')
    response.relatedRecordGroups[0].should.have.property('count', 11)
  })
})
