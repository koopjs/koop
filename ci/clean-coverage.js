const shell = require('shelljs');

shell.rm('-rf', './**/.coverage');
shell.rm('-rf', '.coverage');
shell.rm('.branch-coverage-changes.md');
