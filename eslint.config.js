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
    semi: ['error', 'always'],
    'prettier/prettier': ['error', { endOfLine: 'auto', printWidth: 100 }],
    'no-only-tests/no-only-tests': 'error',
    'max-len': ['error', { code: 100 }],
  },
  plugins: {
    'no-only-tests': noOnlyTests,
    prettier: prettier,
  },
};
