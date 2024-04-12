const { workspaces } = require('../package.json');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const context = argv.context || 'all';

workspaces.forEach((workspace) => {
  process.chdir(workspace);
  const package = workspace.split(path.sep).pop();

  const coverageDir = path.join('.coverage', context);
  const packageCoverageDirectory = path.join(process.cwd(), '.coverage', context);

  console.log(`Package "${package}":`);

  if (!fs.existsSync(packageCoverageDirectory)) {
    console.log(`${coverageDir} not found in ${workspace}; skipping`);
    process.chdir('../..');
    return;
  }

  process.stdout.write(`  - merging ${context} test coverage results...`);
  shell.exec(getCmd(package, coverageDir));
  process.stdout.write('completed.\n\n');
  process.chdir('../..');
});

function getCmd(package, coverageDir) {
  const destination = path.join('..', '..', coverageDir);
  if (package === 'output-geoservices') {
    return `cp ${coverageDir}/coverage-final.json ${destination}/output-geoservices.json > /dev/null`;
  }

  return `npx nyc merge ${coverageDir}/analysis ${destination}/${package}.json > /dev/null`;
}
