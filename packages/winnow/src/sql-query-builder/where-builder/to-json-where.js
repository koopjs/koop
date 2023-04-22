/**
 * This file exposes a function to:
 * 1. parse the input where clause into an AST
 * 2. traverse the AST to reconstruct a SQL suitable for winnow's custom alasql
 */

const parser = require('js-sql-parser');
const { InvalidWhereParameterError } = require('../../errors');

function translateSqlWhere(where, { esri, esriFields } = {}) {
  try {
    const ast = parser.parse(`SELECT * FROM koop WHERE ${where}`);
  
    // TODO: move this to options normalization
    const codedValueLookup = getCodedValueMap(esriFields);

    ast.value.where = traverse(ast.value.where, { esri, codedValueLookup });
    return parser.stringify(ast).replace(' SELECT * FROM koop WHERE ', '');
  } catch (error) {
    const err = new InvalidWhereParameterError(where);
    err.stack = error.stack;
    throw err;
  }
}


/**
 * Traverse a SQL AST; modify for JSON querying and return
 * @param  {object} node    AST node
 * @param  {object} options winnow options
 * @return {string}         AST node
 */
function traverse(node, options) {
  if (!node) {
    return;
  }

  trackTargetColumn(node);

  if (node.type === 'Identifier') {
    return handleColumn(node, options);
  }

  if (node.type === 'String') {
    return shouldHandleAsColumn(node) ? handleColumn(node, options) : handleValue(node, options);
  }

  if (['Number', 'Boolean'].includes(node.type)) {
    return handleValue(node, options);
  }

  if (Array.isArray(node)) {
    node.forEach((child) => traverse(child, options));
  }

  traverse(node.left, options);
  traverse(node.right, options);
  traverse(node.value, options);
  traverse(node.params, options);

  return node;
}

function handleColumn(node, options) {
  node.value = node.value.replace(/^"([^"]*)"$/, (match, val) => val);
  node.value = options?.esri
    ? `attributes->\`${node.value}\``
    : `properties->\`${node.value}\``;
}

function shouldHandleAsColumn (node) {
  return /^"([^"]*)"$/.test(node.value);
}

function handleValue(node, { codedValueLookup }) {
  if (node.targetColumnName in codedValueLookup) {
    const key = node.value.replace(/'([^']*)'/, (match, val) => val);
    node.value = `'${codedValueLookup[node.targetColumnName][key]}'`;
  }
}

function trackTargetColumn (node) {
  if (node?.left?.type === 'Identifier') {
    node.right.targetColumnName = node.left.value;
  }

  if (node?.right?.type === 'Identifier') {
    node.left.targetColumnName = node.right.value;
  }

  // distribute target column to any downstream nodes; required for IN
  if (node.targetColumnName) {
    if (Array.isArray(node.value)) {
      node.value.forEach((child) => child.targetColumnName = node.targetColumnName);
    }

    if (node.left) {
      node.left.targetColumnName = node.targetColumnName;
    }
    if (node.right) {
      node.right.targetColumnName = node.targetColumnName;
    }
  }
}

function getCodedValueMap(featureLayerFieldDefintions = []) {
  return featureLayerFieldDefintions
    .filter(fieldDefintion => fieldDefintion?.domain?.type === 'codedValue')
    .map(({ name, domain: { codedValues } }) => {
      return {
        name,
        codedValues: codedValues.reduce((accumulator, { code, name }) => {
          accumulator[code] = name;
          return accumulator;
        }, {})
      };
    })
    .reduce((accumulator, {name, codedValues}) => {
      accumulator[name] = codedValues;
      return accumulator;
    }, {});
}

module.exports = translateSqlWhere;
