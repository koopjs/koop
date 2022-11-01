const fs = require('fs')
const path = require('path')
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))
module.exports = {
  extends: ["@commitlint/config-conventional"],
  prompt: { 
    scopes: [...packages],
    enableMultipleScopes: true,
    scopeEnumSeparator: "," 
  },
  rules: {
    'scope-enum': [2, 'always', [...packages]]
  }
}