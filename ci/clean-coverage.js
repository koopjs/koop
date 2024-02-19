const shell = require('shelljs');

shell.rm('-rf', 'coverage');
shell.rm('-rf', 'coverage_unit');
shell.rm('-rf', 'coverage_changes');
shell.rm('-rf', '.nyc_output');
shell.rm('-rf', '.nyc_output_unit');
shell.rm('-rf', '.nyc_output_changes');