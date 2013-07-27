module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    jshint: {
      files: [ 'gruntfile.js', 'api/**/*.js', 'test/*.js', 'test/**/*.js' ],
      options: {
        globals: {
          node: true
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', [ 'mochaTest' ]);
  grunt.registerTask('default', [ 'jshint', 'test']);

};
