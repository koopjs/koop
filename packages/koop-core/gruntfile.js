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
          reporter: 'nyan',
          timeout: 5000
        },
        src: ['test/**/*.js'],
      }
    },

    express: {
      options: {
        // Override defaults here
        port: 1337
      },
      dev: {
        options: {
          script: './app.js'
        }
      },
      prod: {
        options: {
          script: './app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: './app.js'
        }
      }
    },

    watch: {
      express: {
        files:  [ '**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', [ 'mochaTest' ]);
  grunt.registerTask('server', [ 'express:dev', 'watch' ]);
  grunt.registerTask('default', [ 'jshint', 'test']);

};
