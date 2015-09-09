'use strict';

import AppConfig from './config.js';

import SongsService from './services/songs.js';
import PlaylistService from './services/playlist.js';
import PlayWidgetHelper from './services/play-widget-helper.js';

import SongsDirective from './directives/songs.js';
import SongRatingDirective from './directives/song-rating.js';
import PlaylistDirective from './directives/playlist.js';
import PlayWidgetDirective from './directives/play-widget.js';

angular.module('beatbox', [
  AppConfig.name,

  SongsService.name,
  PlaylistService.name,
  PlayWidgetHelper.name,

  SongsDirective.name,
  SongRatingDirective.name,
  PlaylistDirective.name,
  PlayWidgetDirective.name
]);

