const { writeFileSync, existsSync } = require('fs');
const json2md = require('json2md');
const coverageSummary = require('../.coverage_json/coverage-summary.json');
const markdownFilePath = '.branch-coverage-changes.md';

if (!existsSync('.coverage_changes_json/coverage-summary.json')) {
  writeFileSync(
    markdownFilePath,
    `## Coverage Report (change vs master)
  No changes.
  `,
    'utf8',
  );
  process.exit();
}

const coverageChangesSummary = require('../.coverage_changes_json/coverage-summary.json');

const rows = Object.entries(coverageChangesSummary)
  .filter(([filePath]) => {
    return filePath !== 'total';
  })
  .map(([filePath, changesCoverage]) => {
    const packageFilePath = `packages${filePath.split('packages')[1]}`;
    const masterCoverage = coverageSummary[packageFilePath];

    return [
      packageFilePath,
      formatCovComparison(
        changesCoverage.statements.pct,
        masterCoverage?.statements?.pct || 'NA',
      ),
      formatCovComparison(
        changesCoverage.branches.pct,
        masterCoverage?.branches?.pct || 'NA',
      ),
      formatCovComparison(
        changesCoverage.functions.pct,
        masterCoverage?.functions?.pct || 'NA',
      ),
      formatCovComparison(
        changesCoverage.lines.pct,
        masterCoverage?.lines?.pct || 'NA',
      ),
    ];
  });

const headers = ['File Path', 'Statements', 'Branches', 'Functions', 'Lines'];

const table = json2md([
  { h2: 'Coverage Report (change vs master)' },
  { table: { headers, rows } },
]);

const alignedTable = table.replace(
  '| --------- | ---------- | -------- | --------- | ----- |',
  '| :--------- | ----------: | --------: | ---------: | -----: |',
);

const markdown = `[g-img]: https://github.com/koopjs/koop/assets/4369192/fd82d4b7-7f6e-448c-a56c-82ac6781a629
[yg-img]: https://github.com/koopjs/koop/assets/4369192/683b2df8-7379-4e4f-bb36-f5e20b2631d6
[y-img]: https://github.com/koopjs/koop/assets/4369192/d5214a5c-c5a9-4449-82ca-8a4e922ef9ef
[o-img]: https://github.com/koopjs/koop/assets/4369192/8651f10c-e986-491d-8b51-bc559aac88a2
[r-img]: https://github.com/koopjs/koop/assets/4369192/a37a56ac-228d-40d9-8ebc-804dbbf08355

${alignedTable}`;

writeFileSync(markdownFilePath, markdown, 'utf8');

function formatCovComparison(changePct, mainPct) {
  return `${formatCovPct(changePct)}<br>vs<br>${formatCovPct(mainPct)}`;
}

function formatCovPct(pct) {
  if (pct === 100) {
    return `${pct} ![green][g-img]`;
  }

  if (pct > 90) {
    return `${pct} ![yellowGreen][yg-img]`;
  }

  if (pct > 80) {
    return `${pct} ![yellow][y-img]`;
  }

  if (pct > 70) {
    return `${pct} ![orange][o-img]`;
  }

  return `${pct} ![red][r-img]`;
}
