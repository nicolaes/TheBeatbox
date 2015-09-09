'use strict';

describe('play widget helper', function () {
  var playWidgetHelper;

  beforeEach(module('beatbox'));

  beforeEach(inject(function (_playWidgetHelper_) {
    playWidgetHelper = _playWidgetHelper_;
  }));

  describe('song duration converter', function(){
    it('should convert seconds', function () {
      expect(playWidgetHelper.getSongDurationInSeconds('06')).toEqual(6);
    });

    it('should convert minutes:seconds', function () {
      expect(playWidgetHelper.getSongDurationInSeconds('5:06')).toEqual(306);
    });

    it('should convert hours:minutes:seconds', function () {
      expect(playWidgetHelper.getSongDurationInSeconds('1:05:06')).toEqual(3906);
    });
  });

  describe('progress bar percentage', function(){
    it('should convert to integer percentages', function () {
      expect(playWidgetHelper.getProgressPercentage(6/7)).toEqual(86);
    });

    it('should not return out of bounds values', function () {
      expect(playWidgetHelper.getProgressPercentage(-1)).toEqual(0);
      expect(playWidgetHelper.getProgressPercentage(2)).toEqual(100);
    });
  });
});
