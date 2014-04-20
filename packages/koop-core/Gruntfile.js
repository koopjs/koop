/**
 * Gruntfile
 *
 */

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan',
          timeout: 30000
        },
        src: ['./test/**/*.js'],
      }
    },

    watch: {
      api: {
        // API files to watch:
        files: ['api/**/*']
      }
      /*assets: {
        // Assets to watch:
        files: ['assets/*'],
        // When assets are changed:
        tasks: ['compileAssets', 'linkAssets']
      }*/
    }

  });

  // When Sails is lifted:
  grunt.registerTask('watch', [
    'watch'
  ]);

  //grunt.registerTask('heroku:production', ['prod']);
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('test', [ 'mochaTest:test' ]);

  grunt.registerTask('runNode', function () {
    grunt.util.spawn({
      cmd: 'node',
      args: ['./node_modules/nodemon/nodemon.js', 'server.js'],
      opts: {
        stdio: 'inherit'
      }
    }, function () {
      grunt.fail.fatal(new Error("nodemon quit"));
    });
  });

  grunt.registerTask('server', ['runNode', 'watch']);
};
