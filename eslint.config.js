const noOnlyTests = require('eslint-plugin-no-only-tests');

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
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-only-tests/no-only-tests': 'error',
  },
  plugins: {
    'no-only-tests': noOnlyTests
  },
};
