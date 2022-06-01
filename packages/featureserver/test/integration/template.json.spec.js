const featuresJson = require('../../templates/features.json')
const { featuresTemplateSchema } = require('./schemas')

describe('Template content', () => {
  describe('features.json', () => {
    it('should conform to the prescribed schema', () => {
      // Use Joi to build expected schema and test against JSON.
      featuresTemplateSchema.validate(featuresJson, { presence: 'required' }).should.not.have.property('error')
    })
  })
})
