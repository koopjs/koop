const shell = require('shelljs');
const git = require('simple-git');
const path = require('path');

const { workspaces } = require('../package.json');

async function execute () {
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = workspaces[i];
    process.chdir(workspace);
    const package = workspace.split(path.sep).pop();

    const {files} = await git().diffSummary(['--name-only', '--relative', 'origin/master']);

    const srcFiles = files.filter(({ file }) => {
      return file.endsWith('.js') && !file.endsWith('spec.js');
    }).map(({ file }) => {
      return `-n ${file}`;
    });

    if (srcFiles.length === 0) {
      process.chdir('../..');
      continue;
    }

    console.log(`Package "${package}":`);
    process.stdout.write('  - running branch-changes test coverage...');
    shell.exec(getCovCmd(package, srcFiles));
    process.stdout.write('completed.\n\n');
    process.chdir('../..');
  }
}

execute().then(() => {
  process.exit();
}).catch(error => {
  console.error(error);
  process.exit(1);
});


function getCovCmd(package, srcFiles) {
  if (package === 'output-geoservices') {
    return 'npm test -- --coverage --changedSince=master --coverageDirectory=.coverage/changes  --reporters --silent > /dev/null';
  }

  return `npx nyc -r=json --report-dir=.coverage/changes --temp-dir=.coverage/changes/analysis ${srcFiles.join(' ')} ${getTestCmd(package)}`;
}

function getTestCmd(package) {
  if (package === 'featureserver' || package === 'winnow') {
    return 'npm run test:unit > /dev/null';
  }

  return 'npm run test > /dev/null';
}