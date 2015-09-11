var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserify  = require('browserify');
var browserSync = require('browser-sync');
var buffer      = require('vinyl-buffer');
var nib         = require('nib')
var rename      = require('gulp-rename')
var sourcemaps  = require('gulp-sourcemaps');
var streamify   = require('gulp-streamify')
var stylus      = require('gulp-stylus')
var template    = require('gulp-template');
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var watchify    = require('watchify');
var assign      = require('object-assign')

var reload      = browserSync.reload;

var ENV  = ['dev', 'prod']
var LANG = ['ca', 'es', 'en']

gulp.task('copyfonts', function() {
  gulp.src('./src/fonts/**/*.{ttf,woff,eot,svg}', { base: 'src/fonts/'})
    .pipe(gulp.dest('./dist/generic/fonts/'));
});
gulp.task('copyjquery', function() {
  console.log('copy jquery')
  gulp.src('bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./dist/generic/js/vendor/'));
});

gulp.task('stylus', function(){
  gulp.src('src/styles/main.styl')
    .pipe(stylus({ use: nib(), compress: true }))
    .pipe(gulp.dest('./dist/generic/styles/'))
    .pipe(reload({ stream: true }))
});

ENV.forEach(function (env) {
  LANG.forEach(function (lang) {
    var path  = env + '/' + lang
    var sufix = env + '-' + lang

    gulp.task('cname:' + sufix, function () {
       require('fs').writeFile('dist/' + path + '/CNAME', lang + '.juggol.com')
    })

    gulp.task('template:' + sufix, function() {
       gulp.src(['src/index.html.tpl'])
       .pipe(template(require('./src/lang/' + lang + '.js')))
       .pipe(rename('index.html'))
       .pipe(gulp.dest('dist/' + path + '/'))
       .pipe(reload({ stream: true }))
    });
    
    gulp.task('js:' + sufix, function(){
      browserifyShare();
    });

    function browserifyShare() {
      var customOpts = {
        //entries: ['./src/index.js'],
        debug: true,
        fullPaths: false
      };
      var opts = assign({}, watchify.args, customOpts);
      // create transform
      var aliasify = require('aliasify').configure({
        aliases: {
          'language': './src/js/messages/lang/' + lang + '.js'
        },
        configDir: __dirname,
        verbose: false
      })

      // create browserify bundle
      var b = watchify(browserify(opts))

      b.transform(aliasify)
      b.on('update', function () {
        bundleShare(b);
      })
      b.add('./src/js/main.js');
      bundleShare(b);
    }

    function bundleShare (b) {
      return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(streamify(uglify()))
        .pipe(sourcemaps.write('./'))
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
    
    gulp.task('deploy:' + sufix, [
      'copyfonts',
      'copyjquery',
      'js:' + sufix,
      'stylus', 
      'template:' + sufix,
      'cname:' + sufix,
      ], function() {
    
      gulp.watch(['src/index.html.tpl', 'src/lang/*.js'], ['template:' + sufix]);
      gulp.watch('src/styles/**/*.styl', ['stylus:' + sufix]);
      gulp.watch(['src/js/main.js', 'src/js/Juggler/**/*.js'], ['js:' + sufix]);  
    });

  })
})