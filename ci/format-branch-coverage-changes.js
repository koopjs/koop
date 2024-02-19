const { writeFileSync } = require('fs');
const json2md = require('json2md');
const coverageSummary = require('../coverage_changes/coverage-summary.json');

const rows = Object.entries(coverageSummary)
  .filter(([filePath]) => {
    return filePath !== 'total';
  })
  .map(([filePath, value]) => {
    const packagePath = filePath.split('packages')[1];
    return [
      `packages${packagePath}`,
      getValue(value.statements),
      getValue(value.branches),
      getValue(value.functions),
      getValue(value.lines),
    ];
  });

const headers = ['File Path', 'Statements', 'Branches', 'Functions', 'Lines'];
const markdown = json2md([{ h2: 'Coverage Report'}, { table: { headers, rows } }]);
const aligned = markdown.replace('| --------- | ---------- | -------- | --------- | ----- |', '| :--------- | ----------: | --------: | ---------: | -----: |');
writeFileSync('ci/branch-coverage-changes.md', aligned, 'utf8');

function getValue(input) {
  if (input.pct === 100) {
    return `${input.pct} ![green](https://github.com/koopjs/koop/assets/4369192/fd82d4b7-7f6e-448c-a56c-82ac6781a629)`;
  }

  if (input.pct > 90) {
    return `${input.pct} ![yellow-green](https://github.com/koopjs/koop/assets/4369192/683b2df8-7379-4e4f-bb36-f5e20b2631d6)`;
  }

  if (input.pct > 80) {
    return `${input.pct} ![yellow](https://github.com/koopjs/koop/assets/4369192/d5214a5c-c5a9-4449-82ca-8a4e922ef9ef)`;
  }

  if (input.pct > 70) {
    return `${input.pct} ![orange](https://github.com/koopjs/koop/assets/4369192/8651f10c-e986-491d-8b51-bc559aac88a2)`;
  }

  return `${input.pct} ![red](https://github.com/koopjs/koop/assets/4369192/83e9c13e-0548-4b97-a116-6e49f77a8f38)`;
}

