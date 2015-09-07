'use strict';

describe('The main view', function () {
  var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.page');
    browser.wait(page.songs.isPresent());
  });

  it('should be a page', function() {
    expect(page.songs.count()).toBeGreaterThan(0);
  });

  it('should display a list of songs', function() {
    expect(page.songs.count()).toBeGreaterThan(0);
  });
});
