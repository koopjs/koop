const noOnlyTests = require('eslint-plugin-no-only-tests');
const prettier = require('eslint-plugin-prettier');

module.exports = {
  languageOptions: {
    globals: {
    commonjs: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
    node: true,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    process: 'readonly',
    console: 'readonly',
    __dirname: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
},
  
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'semi': ['error', 'always'],
    'prettier/prettier': ["error"],
    'no-only-tests/no-only-tests': 'error',
    'linebreak-style': ['error', 'unix'],
  },
  plugins: {
    'no-only-tests': noOnlyTests,
    'prettier':  prettier
  },
};
