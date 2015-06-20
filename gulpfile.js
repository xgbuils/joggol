var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserify  = require('browserify');
var browserSync = require('browser-sync');
var nib         = require('nib')
var rename      = require('gulp-rename')
var streamify   = require('gulp-streamify')
var stylus      = require('gulp-stylus')
var template    = require('gulp-template');
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var watchify    = require('watchify');

var reload      = browserSync.reload;

var ENV  = ['dev', 'prod']
var LANG = ['ca', 'es', 'en']

ENV.forEach(function (env) {
  LANG.forEach(function (lang) {
    var path  = env + '/' + lang
    var sufix = env + '-' + lang

    gulp.task('cname:' + sufix, function () {
       require('fs').writeFile('dist/' + path + '/CNAME', lang + '.juggol.com')
    })

    gulp.task('copyfonts:' + sufix, function() {
       gulp.src('./src/fonts/**/*.{ttf,woff,eot,svg}', { base: 'src/fonts/'})
       .pipe(gulp.dest('./dist/' + path + '/fonts'));
    });

    gulp.task('copyjquery:' + sufix, function() {
       gulp.src('bower_components/jquery/dist/jquery.min.js')
       .pipe(gulp.dest('./dist/' + path + '/js/vendor/'));
    });
    
    gulp.task('template:' + sufix, function() {
       gulp.src(['src/index.html.tpl'])
       .pipe(template(require('./src/lang/' + lang + '.js')))
       .pipe(rename('index.html'))
       .pipe(gulp.dest('dist/' + path + '/'))
       .pipe(reload({ stream: true }))
    });
    
    gulp.task('stylus:' + sufix, function(){
        gulp.src('src/styles/main.styl')
            .pipe(stylus({ use: nib(), compress: true }))
            .pipe(gulp.dest('./dist/' + path + '/styles/'))
            .pipe(reload({ stream: true }))
    });

    gulp.task('js:' + sufix, function(){
      browserifyShare();
    });

    function browserifyShare() {
      // create transform
      var aliasify = require('aliasify').configure({
        aliases: {
          'language': './src/js/messages/lang/' + lang + '.js'
        },
        configDir: __dirname,
        verbose: false
      })

      // create browserify bundle
      var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: false
      })
      b = watchify(b)

      b.transform(aliasify)
      b.on('update', function () {
        bundleShare(b);
      })

      b.add('./src/js/main.js');
      bundleShare(b);
    }

    function bundleShare (b) {
      b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist/' + path + '/js/'));
    }
   
    function bundle() {
      return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist/' + path + '/js'))
    }
    
    gulp.task('serve:' + sufix, [
      'copyfonts:' + sufix,
      'copyjquery:' + sufix,
      'js:' + sufix,
      'stylus:' + sufix, 
      'template:' + sufix,
      'cname:' + sufix,
      ], function() {
      browserSync({
        server: {
          baseDir: 'dist/' + path + '/'
        }
      });
    
      gulp.watch(['src/index.html.tpl', 'src/lang/*.js'], ['template:' + sufix]);
      gulp.watch('src/styles/**/*.styl', ['stylus:' + sufix]);
      gulp.watch(['src/js/main.js', 'src/js/Juggler/**/*.js'], ['js:' + sufix]);  
    });

  })
})