const shell = require('shelljs');
const git = require('simple-git');

git().diffSummary(['--name-only', '--relative', 'origin/master'])
  .then(summary => {
    const {files} = summary;
    const srcFiles = files.filter(({ file }) => {
      return file.endsWith('.js') && !file.endsWith('spec.js');
    }).map(({ file }) => {
      return `-n ${file}`;
    });

    if (srcFiles.length === 0) {
      process.exit();
    }

    const cmd = `nyc -r=json-summary --report-dir=coverage_changes --temp-dir=.nyc_output_changes ${srcFiles.join(' ')} npm run test:quiet`;
    shell.exec(cmd);
  });

//console.log(diff)