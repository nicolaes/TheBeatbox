'use strict';

describe('playlist service', function () {
  var playlistService, httpBackend;

  var playlistSongs = [
    {
      id: 1,
      track_title: 'Track 1',
    },
    {
      id: 2,
      track_title: 'Track 2',
    }
  ];

  beforeEach(module('beatbox'));

  describe('playlist service getAll method', function(){
    var getSongsByIdsPromise;

    beforeEach(module(function($provide){
      $provide.service('songsService', function($q){
        getSongsByIdsPromise = jasmine.createSpy('getSongsByIdsPromise').and.callFake(function(){
          var deferred = $q.defer();

          deferred.resolve(playlistSongs);

          return deferred.promise;
        });

        this.getSongsByIdsPromise = getSongsByIdsPromise;
      });
    }));

    beforeEach(inject(function (_playlistService_, $httpBackend, appConfig) {
      playlistService = _playlistService_;
      httpBackend = $httpBackend;

      // Send mock data
      httpBackend.whenGET(appConfig.restUrl + 'playlist-songs').respond([
        {id: 1},
        {id: 2}
      ]);
    }));

    it('should retrieve the playlist', function () {
      var songs = playlistService.getAll();
      httpBackend.flush();

      expect(getSongsByIdsPromise).toHaveBeenCalledWith(jasmine.arrayContaining([1, 2]));
      expect(songs.length).toEqual(2);
    });
  });

  describe('playlist service next/previous song methods', function() {
    beforeEach(function() {
      playlistService.playlistSongs = playlistSongs;
    });

    it('should get the next song of the playlist', function () {
      expect(playlistService.getNextByCurrentSongId(1))
        .toEqual(jasmine.objectContaining({id: 2}));
    });

    it('should return NULL when requesting a song after the last playlist song', function () {
      expect(playlistService.getNextByCurrentSongId(2))
        .toBeNull();
    });

    it('should get the previous song of the playlist', function () {
      expect(playlistService.getPreviousByCurrentSongId(2))
        .toEqual(jasmine.objectContaining({id: 1}));
    });

    it('should return NULL when requesting a song before the first playlist song', function () {
      expect(playlistService.getPreviousByCurrentSongId(1))
        .toBeNull();
    });
  });
});
