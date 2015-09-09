'use strict';

class PlaylistService {
  constructor($q, $log, $resource, appConfig, songsService) {
    this.$q = $q;
    this.$log = $log;
    this.songsService = songsService;

    this.playlistSongsRequested = false;
    this.playlistSongsReceived = false;
    this.playlistSongs = [];

    this.resource = $resource(appConfig.restUrl + 'playlist-songs/:songId');
  }

  getAll() {
    if (this.playlistSongsRequested === false) {
      this.playlistSongsRequested = true;

      this.resource.query().$promise.then((songIdObjects) => {
        let songIds = songIdObjects.map((songObj) => songObj.id);

        // Keep a static reference to this.playlistSongs
        this.songsService.getSongsByIdsPromise(songIds).then((songs) => {
          Array.prototype.push.apply(this.playlistSongs, songs);
          this.playlistSongsReceived = true;
        });
      });
    }
    return this.playlistSongs;
  }

  getPlaylistIndexBySongId(songId) {
    for (let i = 0; i < this.playlistSongs.length; i++) {
      if (this.playlistSongs[i].id === songId) {
        return i;
      }
    }
    return -1;
  }

  getNextByCurrentSongId(songId) {
    let currentIndex = this.getPlaylistIndexBySongId(songId);
    if (currentIndex === -1) {
      this.$log.info('Song is not in the playlist');
      return null;
    }

    if (currentIndex === (this.playlistSongs.length - 1)) {
      this.$log.info('Next song not available');
      return null;
    }

    return this.playlistSongs[currentIndex + 1];
  }

  getPreviousByCurrentSongId(songId) {
    let currentIndex = this.getPlaylistIndexBySongId(songId);
    if (currentIndex === -1) {
      this.$log.info('Song is not in the playlist');
      return null;
    }

    if (currentIndex === 0) {
      this.$log.info('Previous song not available');
      return null;
    }

    return this.playlistSongs[currentIndex - 1];
  }

  addById(songId) {
    let deferred = this.$q.defer();

    if (this.playlistSongsReceived !== true) {
      this.$log.error('Can not manipulate the playlist before loading it.');
      deferred.reject();
      return deferred.promise;
    }
    if (this.getPlaylistIndexBySongId(songId) !== -1) {
      this.$log.info('Song already exists in the playlist');
      deferred.resolve();
      return deferred.promise;
    }

    this.songsService.getSongsByIdsPromise([songId]).then((songs) => {
      if (songs.length !== 1) {
        this.$log.error('Song not found');
        deferred.reject();
        return;
      }

      let song = songs[0];
      this.resource.save({id: songId}, () => {
        this.playlistSongs.push(song);
        deferred.resolve();
      });
    }, deferred.reject);

    return deferred.promise;
  }

  removeById(songId) {
    let deferred = this.$q.defer();

    if (this.getPlaylistIndexBySongId(songId) === -1) {
      this.$log.error('Song is not in the playlist');
      deferred.reject();
      return deferred.promise;
    }

    this.resource.delete({songId: songId}, () => {
      let songIndex = this.getPlaylistIndexBySongId(songId);
      this.playlistSongs.splice(songIndex, 1);
      deferred.resolve();
    });

    return deferred.promise;
  }
}

export default angular.module('beatbox.services.playlist', ['ngResource'])
  .service('playlistService', ['$q', '$log', '$resource', 'appConfig', 'songsService', PlaylistService]);
