'use strict';

var path = require('path');
var wiredep = require('wiredep');

var files = wiredep({
  dependencies: true,
  devDependencies: true
}).js
  .concat([
    '.tmp/scripts/index.js',
    'app/scripts/**/*.spec.js'
  ]);

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    singleRun: true,
    autoWatch: false,
    files: files,
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-chrome-launcher'
    ]
  })
}
