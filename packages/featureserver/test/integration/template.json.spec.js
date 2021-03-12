const featuresJson = require('../../templates/features.json')
const fieldJson = require('../../templates/field.json')
const layerJson = require('../../templates/layer.json')
const oidFieldJson = require('../../templates/oid-field.json')
const { featuresTemplateSchema, fieldsTemplateSchema, layersTemplateSchema, oidTemplateSchema } = require('./schemas')

describe('Template content', () => {
  describe('features.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      featuresTemplateSchema.validate(featuresJson, { presence: 'required' }).should.not.have.property('error')
    })
  })

  describe('field.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      fieldsTemplateSchema.validate(fieldJson, { presence: 'required' }).should.not.have.property('error')
    })
  })

  describe('layer.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      layersTemplateSchema.validate(layerJson, { presence: 'required' }).should.not.have.property('error')
    })
  })

  describe('oid-field.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      oidTemplateSchema.validate(oidFieldJson, { presence: 'required' }).should.not.have.property('error')
    })
  })
})
