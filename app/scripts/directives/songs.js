'use strict';

class SongsController {
  constructor(songsService, playlistService) {
    this.songsService = songsService;
    this.playlistService = playlistService;

    this.songs = this.songsService.getAll();
    this.orderBy = '';
    this.searchKey = '';
    this.searchedProperties = ['track_title', 'artist_name', 'genre'];
    this.searchFilter = this.searchFilter.bind(this);
  }

  addToPlaylist(songId) {
    this.playlistService.addById(songId);
  }

  getDurationAndBitRate(song) {
    return song.track_duration + ' (' + Math.floor(song.track_bit_rate/1000) + ' kbps)';
  }

  searchFilter(song) {
    let searchKey = this.searchKey.toLowerCase();
    for (let i = 0; i < this.searchedProperties.length; i++) {
      let propValue = song[this.searchedProperties[i]];
      if (typeof propValue === 'undefined') {
        continue;
      }

      if (propValue.toLowerCase().indexOf(searchKey) !== -1) {
        return true;
      }
    }
    return false;
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
