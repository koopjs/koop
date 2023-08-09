module.exports = {
  env: {
    commonjs: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
    node: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    process: 'readonly',
    console: 'readonly',
    __dirname: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    indent: ['error', 2, {'SwitchCase': 1}],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
