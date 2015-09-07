'use strict';

export default angular.module('beatbox.config', [])
  .value('appConfig', {
    restUrl: 'http://localhost:3000/'
  });
