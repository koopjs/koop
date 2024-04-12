const { workspaces } = require('../package.json');
const shell = require('shelljs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const context = argv.context || 'all';

workspaces.forEach((workspace) => {
  process.chdir(workspace);
  const package = workspace.split(path.sep).pop();
  console.log(`Package "${package}":`);
  process.stdout.write(`  - running ${context} test coverage...`);
  shell.exec(getCovCmd(package, context));
  process.stdout.write('completed.\n');
  process.stdout.write(`  - generating ${context} test coverage badge...`);
  shell.exec(getBadgeCmd(package, context));
  process.stdout.write('completed.\n\n');
  process.chdir('../..');
});

function getCovCmd(package, context) {
  if (package === 'output-geoservices') {
    return 'npm test -- --coverage --coverageDirectory=.coverage/all --reporters --silent > /dev/null';
  }

  return `npx cross-env SUPPRESS_NO_CONFIG_WARNING=true nyc -r=json-summary -r=json --report-dir=.coverage/all --temp-dir=.coverage/all/analysis ${getTestCmd(package, context)}`;
}

function getBadgeCmd(package, context) {
  if (context === 'unit' && (package === 'featureserver' || package === 'winnow')) {
    return 'npx coverage-badges-cli --source .coverage/all/coverage-summary.json --output ./coverage-unit.svg > /dev/null';
  }

  return 'npx coverage-badges-cli --source .coverage/all/coverage-summary.json --output ./coverage.svg > /dev/null';
}

function getTestCmd(package, context) {
  if (context === 'unit' && (package === 'featureserver' || package === 'winnow')) {
    return 'npm run test:unit > /dev/null';
  }

  return 'npm run test > /dev/null';
}
