'use strict';

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var webpack = require('webpack-stream');
var KarmaServer = require('karma').Server;
var path = require('path');
var $ = require('gulp-load-plugins')();

gulp.task('scripts', ['clean:scripts'], function(){
  return gulp.src('app/scripts/index.js')
    .pipe(webpack({
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel' }
        ]
      },
      devtool: "#inline-source-map",
      output: {
        filename: 'index.js'
      }
    }))
    .pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('styles', ['clean:styles'], function(){
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('wiredep', function(){
  return gulp.src('app/index.html')
    .pipe(wiredep({
      dependencies: true,
      devDependencies: false
    }))
    .pipe(gulp.dest('.tmp'));
});

var jsonSrvWrapper = null;
function startJsonSrv() {
  jsonSrvWrapper = $.jsonSrv.start({
    data: 'data/db.json',
    id: 'id'
  });
}
function stopJsonSrv() {
  if (jsonSrvWrapper !== null) {
    jsonSrvWrapper.kill();
  }
}
gulp.task('json-server', startJsonSrv);

gulp.task('clean:scripts', function(){
  return gulp.src('.tmp/scripts', {read: false})
    .pipe($.clean());
});

gulp.task('clean:styles', function(){
  return gulp.src('.tmp/styles', {read: false})
    .pipe($.clean());
});

gulp.task('test:unit', ['scripts'], function(done) {
  new KarmaServer({
    configFile: path.join(__dirname, '/karma.conf.js'),
    singleRun: true,
    autoWatch: false
  }, done).start();
});

gulp.task('webdriver-update', $.protractor.webdriver_update);
gulp.task('test:protractor', ['serve:e2e', 'webdriver-update'], function(done){
  gulp.src('e2e/*.js')
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function (err) {
      throw err;
    })
    .on('end', function () {
      // Close servers
      $.connect.serverClose();
      stopJsonSrv();
      done();
    });
});

gulp.task('test', ['test:unit', 'test:protractor']);

gulp.task('serve', [
  'scripts',
  'styles',
  'wiredep',
  'json-server'
], function(){
  gulp.watch('app/index.html', ['wiredep']);
  gulp.watch('bower.json', ['wiredep']);

  gulp.watch(['app/**/*.js', '!app/**/*.spec.js'], ['scripts']);
  gulp.watch('app/**/*.scss', ['styles']);

  $.connect.server({
    root: ['.tmp', 'app'],
    livereload: true
  });
});

gulp.task('serve:e2e', [
  'scripts',
  'styles',
  'wiredep',
  'json-server'
], function(){
  $.connect.server({
    root: ['.tmp', 'app']
  });
});
