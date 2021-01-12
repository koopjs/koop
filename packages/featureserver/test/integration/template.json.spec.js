const Joi = require('joi')
const featuresJson = require('../../templates/features.json')
const fieldJson = require('../../templates/field.json')
const layerJson = require('../../templates/layer.json')
const oidFieldJson = require('../../templates/oid-field.json')
const serverJson = require('../../templates/server.json')
const restInfoJson = require('../../templates/rest-info.json')
const { featuresTemplateSchema, fieldsTemplateSchema, layersTemplateSchema, oidTemplateSchema, serverTemplateSchema } = require('./schemas')

describe('Template content', () => {
  describe('features.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      Joi.validate(featuresJson, featuresTemplateSchema, { presence: 'required' }).should.have.property('error', null)
    })
  })

  describe('field.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      Joi.validate(fieldJson, fieldsTemplateSchema, { presence: 'required' }).should.have.property('error', null)
    })
  })

  describe('layer.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      Joi.validate(layerJson, layersTemplateSchema, { presence: 'required' }).should.have.property('error', null)
    })
  })

  describe('oid-field.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      Joi.validate(oidFieldJson, oidTemplateSchema, { presence: 'required' }).should.have.property('error', null)
    })
  })

  describe('rest-info.json', () => {
    it('should conform to the prescribed schema', () => {
      restInfoJson.should.have.property('currentVersion', 10.51)
    })
  })

  describe('server.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.

      Joi.validate(serverJson, serverTemplateSchema, { presence: 'required' }).should.have.property('error', null)
    })
  })
})
