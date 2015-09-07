'use strict';

class SongsController {
  constructor(songsService, playlistService) {
    this.songsService = songsService;
    this.playlistService = playlistService;

    this.songs = this.songsService.getAll();
  }

  addToPlaylist(songId) {
    this.playlistService.addById(songId);
  }

  getDurationAndBitRate(song) {
    return song.track_duration + ' (' + Math.floor(song.track_bit_rate/1000) + ' kbps)';
  }
}


export default angular.module('beatbox.directives.songs', [])
  .directive('songs', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/songs.html',
      controllerAs: 'songsCtrl',
      controller: ['songsService', 'playlistService', SongsController]
    };
  });
