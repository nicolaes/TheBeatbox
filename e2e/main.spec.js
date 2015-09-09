'use strict';

describe('The main view', function () {
  var firstSong;

  beforeEach(function () {
    browser.get('/index.html');
    firstSong = element.all(by.css('.song-list .song-item')).first();
    return browser.wait(firstSong.isPresent());
  });

  it('should display a list of songs', function() {
    expect(element.all(by.repeater('song in songsCtrl.songs')).count()).toBeGreaterThan(0);
  });

  it('should update the rating for a song', function() {
    var plusRating = firstSong.element(by.css('.change-rating.plus'));
    plusRating.click();

    var myRating = firstSong.element(by.css('.my-rating'));
    expect(myRating.getText()).toEqual('3.5');
  });

  it('should not go outside the rating boundaries', function() {
    var minusRating = firstSong.element(by.css('.change-rating.minus'));
    for (var i = 0; i < 10; i++) {
      minusRating.click();
    }

    var myRating = firstSong.element(by.css('.my-rating'));
    expect(myRating.getText()).toEqual('0');
  });
});
