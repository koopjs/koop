const Fields = require('./fields')

class LayerFields extends Fields {
  static create (inputOptions) {
    const options = Fields.normalizeOptions(inputOptions)
    return new LayerFields(options)
  }

  constructor (options) {
    super(options)

    return this.fields.map(field => {
      field.setEditable().setNullable()
      return field
    })
  }
}

module.exports = LayerFields
