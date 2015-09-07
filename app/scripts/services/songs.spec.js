'use strict';

describe('songs service', function () {
  var songsService, httpBackend;

  beforeEach(module('beatbox'));

  beforeEach(inject(function (_songsService_, $httpBackend) {
    songsService = _songsService_;
    httpBackend = $httpBackend;
  }));

  it('should retrieve the list of songs', inject(function (appConfig) {
    httpBackend.whenGET(appConfig.restUrl + 'songs').respond([
      {
        id: 1,
        track_title: 'Track 1',
      },
      {
        id: 2,
        track_title: 'Track 2',
      }
    ]);

    var songs = songsService.getAll();

    httpBackend.flush();

    expect(songs.length).toEqual(2);
  }));
});
