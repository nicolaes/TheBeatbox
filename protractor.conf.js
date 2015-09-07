'use strict';

// An example configuration file.
exports.config = {
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8080',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['e2e/**/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
