const { writeFileSync } = require('fs');
const _ = require('lodash');
const coverageSummary = require('../.coverage_json/coverage-summary.json');
const formattedSummary = _.mapKeys(coverageSummary, (value, key) => {
  if (key === 'total') {
    return key;
  }
  const packagePath = key.split('packages')[1];
  return `packages${packagePath}`;
});

writeFileSync('.coverage_json/coverage-summary.json', JSON.stringify(formattedSummary), 'utf8');
