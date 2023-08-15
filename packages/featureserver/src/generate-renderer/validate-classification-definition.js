const joi = require('joi');
const { CodedError } = require('../helpers/errors');

const classificationDefinitionSchema = joi
  .object({
    type: joi
      .string()
      .valid('classBreaksDef', 'uniqueValueDef')
      .error(new Error('invalid classification type')),
    baseSymbol: joi
      .object({
        type: joi
          .string()
          .valid('esriSMS', 'esriSLS', 'esriSFS')
          .required()
          .error(
            new Error(
              'baseSymbol requires a valid type: esriSMS, esriSLS, esriSFS',
            ),
          ),
      })
      .optional()
      .unknown(),
    uniqueValueFields: joi.array().items(joi.string()),
  })
  .required()
  .unknown()
  .messages({
    'any.required': 'classification definition is required',
  });

function validateClassificationDefinition(
  definition,
  geometryType,
  classification,
) {
  validateDefinitionShape(definition);
  validateDefinitionSymbolAgainstGeometry(definition.baseSymbol, geometryType);
  validateUniqueValueFields(definition, classification);
}

function validateDefinitionShape(definition) {
  const { error } = classificationDefinitionSchema.validate(definition);

  if (error) {
    error.code = 400;
    throw error;
  }
}

function validateDefinitionSymbolAgainstGeometry(
  baseSymbol = {},
  geometryType,
) {
  const { type: symbolType } = baseSymbol;

  if (!symbolType) {
    return;
  }

  if (symbolLookup(geometryType) !== symbolType) {
    const error = new Error(
      'Classification defintion uses a base symbol type that is incompatiable with dataset geometry',
    );
    error.code = 400;
    throw error;
  }
}

function symbolLookup(geometryType) {
  switch (geometryType) {
    case 'esriGeometryPoint':
    case 'esriGeometryMultipoint':
      return 'esriSMS';
    case 'esriGeometryPolyline':
      return 'esriSLS';
    case 'esriGeometryPolygon':
      return 'esriSFS';
    default:
  }
}

function validateUniqueValueFields(definition, classification) {
  const { uniqueValueFields, type } = definition;
  if (type !== 'uniqueValueDef') {
    return;
  }

  if (!uniqueValueFields) {
    throw new CodedError(
      'uniqueValueDef requires a classification definition with "uniqueValueFields" array',
      400,
    );
  }
  const classificationFieldNames = Object.keys(classification[0]);

  if (
    areFieldsMissingFromClassification(
      uniqueValueFields,
      classificationFieldNames,
    )
  ) {
    throw new CodedError(
      `Unique value definition fields are incongruous with classification fields: ${uniqueValueFields.join(
        ', ',
      )} : ${classificationFieldNames.join(', ')}`,
      400,
    );
  }
}

function areFieldsMissingFromClassification(
  definitionFields,
  classificationFieldNames,
) {
  return definitionFields.some(
    (fieldName) => !classificationFieldNames.includes(fieldName),
  );
}

module.exports = validateClassificationDefinition;
