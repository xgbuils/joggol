module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint')

  // commonjs to module for browser
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-focus')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-template');

  var ENV  = ['prod', 'dev']
  var LANG = ['ca', 'es', 'en']

  var browserify = {}
  var connect = {}
  var copy = {
      'fonts-dev-ca': {
        expand: true,
        cwd: 'src/fonts',
        src: ['**/*'],
        dest: 'dist/dev/ca/fonts',
      },
      'fonts-prod-ca': {
        expand: true,
        cwd: 'src/fonts/',
        src: ['**/*'],
        dest: 'dist/prod/ca/fonts/',
      },
    }
  var focus = {}
  var stylus = {
    options: {
      use: [
        require('nib')
      ]
    }
  }
  var template = {}
  var uglify = {}
  var watch = {
    options: {
      livereload: true
    }
  }

  ENV.forEach(function (env) {
    LANG.forEach(function (lang) {
      // browserify
      browserify[env + '-' + lang] = {
        src: 'src/js/main.js',
        dest: 'dist/' + env + '/' + lang + '/js/main.js'
      }

      // focus
      focus[env + '-' + lang] = {
        include: [
          'watch:scripts-'  + env + '-' + lang, 
          'watch:template-' + env + '-' + lang, 
          'watch:stylus-'   + env + '-' + lang
        ]
      }

      // connect
      connect[env + '-' + lang] = {
        options: {
          port: env === 'dev' ? 9090 : 9099,
          hostname: 'localhost',
          base: 'dist/' + env + '/' + lang,
          livereload: true
        }
      }

      // copy jquery
      copy['jquery-' + env + '-' + lang] = {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'dist/' + env + '/' + lang + '/js/',
      }

      // copy fonts
      copy['fonts-' + env + '-' + lang] = {
        expand: true,
        cwd: 'src/fonts',
        src: ['**/*'],
        dest: 'dist/' + env + '/' + lang + '/fonts'
      }

      // stylus
      stylus[env + '-' + lang] = {
        options: {
          linenos: false,
          compress: env === 'prod'
        },
        files: [{
          expand: true,
          cwd: 'src/styles/',
          src: [ 'main.styl' ],
          dest: 'dist/' + env + '/' + lang + '/styles/',
          ext: '.css'
        }]
      }

      // template
      var files = {}
      files['dist/' + env + '/' + lang + '/index.html'] = ['src/index.html.tpl']
      template[env + '-' + lang] = {
        options: {
          data: require('./src/lang/' + lang + '.js')
        },
        files: files
      }

      var scriptTasks = ['browserify:' + env + '/' + lang]
      if (env === 'prod') {
        scriptTasks.push('uglify:prod-' + lang)
      }
      watch['scripts-' + env + '-' + lang] = {
        files: ['src/js/main.js', 'src/js/Juggler/**/*.js'],
        tasks: ['browserify:' + env + '-' + lang]
      }

      watch['stylus-' + env + '-' + lang] = {
        files: ['src/**/*.styl'],
        tasks: ['stylus:' + env + '-' + lang]
      }

      watch['template-' + env + '-' + lang] = {
        files: ['src/index.html.tpl', 'src/lang/*.js'],
        tasks: ['template:' + env + '-' + lang]
      }
    })
  })

  LANG.forEach(function (lang) {
    var files = {}
    files['dist/prod/' + lang + '/js/main.js'] = ['dist/prod/' + lang + '/js/main.js']
    uglify['prod-' + lang] = {
      files: files
    }
  })


  var config = {
    browserify: browserify,
    connect: connect,
    copy: copy,
    focus: focus,
    stylus: stylus,
    template: template,
    uglify: uglify,
    watch: watch,
  }

  grunt.initConfig(config);
  ENV.forEach(function (env) {
    LANG.forEach(function (lang) {
      var sufix = env + '-' + lang
      grunt.registerTask('copy:' + sufix, [
        'template:' + sufix, 
        'copy:fonts-' + sufix, 
        'copy:jquery-'  + sufix
      ])

      var buildTasks = [
        'copy:' + sufix,
        'stylus:' + sufix,
        'browserify:' + sufix
      ]
      if (env === 'prod') {
        buildTasks.push('uglify:prod-' + lang)
      }
      grunt.registerTask('build:' + sufix, buildTasks)

      grunt.registerTask('server:' + sufix, [
        'build:' + sufix, 
        'connect:' + sufix, 
        'switchwatch:scripts-' + sufix + ':' + 'template-' + sufix + ':' + 'stylus-' + sufix
      ]);
/*
      grunt.registerTask('watch:' + env + '-' + lang, [
        'concurrent:watch-' + env + '-' + lang,
      ])*/
    })
  })

  grunt.registerTask('switchwatch', function() {
    var targets = Array.prototype.slice.call(arguments, 0);
    Object.keys(grunt.config('watch')).filter(function(target) {
      return !(grunt.util._.indexOf(targets, target) !== -1);
    }).forEach(function(target) {
      grunt.log.writeln('Ignoring ' + target + '...');
      grunt.config(['watch', target], {files: []});
    });
    grunt.task.run('watch');
  });


};