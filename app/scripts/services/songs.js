'use strict';

class SongsService {
  constructor($q, $resource, appConfig) {
    this.$q = $q;

    this.resource = $resource(appConfig.restUrl + 'songs');

    this.songsRequested = false;
    this.songsPromise = null;

    this.songs = [];
  }

  cacheSongs() {
    if (this.songsRequested === false) {
      this.songsRequested = true;
      this.songsPromise = this.resource.query().$promise;
      this.songsPromise.then((songs) => {
        // Keep the reference to this.songs
        Array.prototype.push.apply(this.songs, songs);
      });
    }
  }

  getAll() {
    this.cacheSongs();

    return this.songs;
  }

  getSongsByIdsPromise(songIds) {
    let deferred = this.$q.defer();

    this.songsPromise.then((songs) => {
      let searchedSongs = [];
      for (let i = 0; i < songs.length; i++) {
        if (songIds.indexOf(songs[i].id) >= 0) {
          searchedSongs.push(songs[i]);
        }
      }
      deferred.resolve(searchedSongs);
    }, deferred.reject);

    return deferred.promise;
  }
}

export default angular.module('beatbox.services.songs', ['ngResource'])
  .service('songsService', ['$q', '$resource', 'appConfig', SongsService]);
