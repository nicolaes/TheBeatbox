'use strict';

var MainPage = function() {
  this.songListWidget = element(by.css('.song-list'));
  this.songsUl = this.songListWidget.element(by.css('ul'));
  this.songs = this.songsUl.element(by.css('li'));

};

module.exports = new MainPage();
