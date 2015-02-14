module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint')

  // commonjs to module for browser
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-concurrent'); // executar tasques paralelament
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.initConfig({
    connect: {
      dev: {
        options: {
          port: 9090,
          hostname: 'localhost',
          base: 'dist/dev',
          livereload: true
        },
        middleware: function(connect, options) {
          return [
            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
            connect.static(options.base)
          ];
        }
      },
      prod: {
        options: {
          port: 9099,
          hostname: 'localhost',
          base: 'dist/prod',
          livereload: true
        }
      },
    },
    watch: {
      options: {
        livereload: true
      },
      'scripts-dev': {
        files: ['src/**/*.js'],
        tasks: ['browserify:dev']
      },
      'scripts-prod': {
        files: ['src/**/*.js'],
        tasks: ['browserify:prod']
      },
      'stylus-dev': {
        files: ['src/**/*.styl'],
        tasks: ['stylus:dev']
      },
      'stylus-prod': {
        files: ['src/**/*.styl'],
        tasks: ['stylus:prod']
      },
      'copy-dev': {
        files: ['src/**/*.html'],
        tasks: ['copy:dev']
      },
      'copy-prod': {
        files: ['src/**/*.html'],
        tasks: ['copy:prod']
      }
    },
    browserify: {
      dev: {
        src: 'src/js/main.js',
        dest: 'dist/dev/js/main.js'
      },
      prod: {
        src: 'src/js/main.js',
        dest: 'dist/prod/js/main.js'
      }
    },
    uglify: {
       prod: {
        files: {
          'dist/prod/js/main.js': ['dist/prod/js/main.js']
        }
      }
    },
    stylus: {
      options: {
        use: [
          require('nib')
        ]
      },
      dev: {
        options: {
          linenos: false,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'src/styles/',
          src: [ 'main.styl' ],
          dest: 'dist/dev/styles/',
          ext: '.css'
        }]
      },
      prod: {
        options: {
          linenos: false,
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'src/styles/',
          src: [ 'main.styl' ],
          dest: 'dist/prod/styles/',
          ext: '.css'
        }]
      },
    },
    copy: {
      'jquery-dev': {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'dist/dev/js/',
      },
      'jquerymobile-dev': {
        expand: true,
        cwd: 'vendor/',
        src: ['jquery.mobile.custom.js'],
        dest: 'dist/dev/js/',
      },
      'html-dev': {
        expand: true,
        cwd: 'src/',
        src: ['**/*.html'],
        dest: 'dist/dev/',
      },
      'fonts-dev': {
        expand: true,
        cwd: 'src/fonts',
        src: ['**/*'],
        dest: 'dist/dev/fonts',
      },
      'jquery-prod': {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'dist/prod/js/',
      },
      'html-prod': {
        expand: true,
        cwd: 'src/',
        src: ['**/*.html'],
        dest: 'dist/prod/',
      },
      'fonts-prod': {
        expand: true,
        cwd: 'src/fonts/',
        src: ['**/*'],
        dest: 'dist/prod/fonts/',
      },
      'jquerymobile-prod': {
        expand: true,
        cwd: 'vendor/',
        src: ['jquery.mobile.custom.js'],
        dest: 'dist/prod/js/',
      },
    }
  });

  grunt.registerTask('copy:dev', ['copy:html-dev', 'copy:fonts-dev', 'copy:jquery-dev', 'copy:jquerymobile-dev']);
  grunt.registerTask('copy:prod', ['copy:html-prod', 'copy:fonts-prod', 'copy:jquery-prod', 'copy:jquerymobile-prod']);
  grunt.registerTask('build:dev', ['copy:dev', 'stylus:dev', 'browserify:dev']);
  grunt.registerTask('build:prod', ['copy:prod', 'stylus:prod', 'browserify:prod', 'uglify:prod']);
  grunt.registerTask('server:dev', ['build:dev', 'connect:dev', 'watch']);
  grunt.registerTask('server:prod', ['build:prod', 'connect:prod', 'watch']);

};