const shell = require('shelljs');
const fs = require('fs');

if (!fs.existsSync('.coverage/changes')) {
  console.log('No changes to report!');
  return;
}

shell.exec(
  'nyc report --temp-dir=.coverage/changes --reporter=json-summary --report-dir=.coverage_changes_json',
);
