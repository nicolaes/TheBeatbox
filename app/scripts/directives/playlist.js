'use strict';

class PlaylistController {
  constructor(songsService, playlistService) {
    this.songsService = songsService;
    this.playlistService = playlistService;

    this.songs = this.playlistService.getAll();
  }

  deleteSongById(songId) {
    this.playlistService.removeById(songId);
  }
}

export default angular.module('beatbox.directives.playlist', [])
  .directive('playlist', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/playlist.html',
      scope: true,
      controllerAs: 'playlistCtrl',
      controller: ['songsService', 'playlistService', PlaylistController]
    };
  });
