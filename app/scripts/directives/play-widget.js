'use strict';

class PlayWidgetController {
  constructor($timeout, $interval, playlistService, playWidgetHelper) {
    this.$timeout = $timeout;
    this.$interval = $interval;
    this.playlistService = playlistService;
    this.playWidgetHelper = playWidgetHelper;

    // Current song properties
    this.setEmptySong();
    this.setEmptySongVariables();
    this.playIntervalCallback = this.playIntervalCallback.bind(this);
  }

  play() {
    if (this.currentSong === null) {
      // Play the first song (if available)
      let firstSong = this.playlistService.getFirstSong();
      return this.playSong(firstSong);
    }

    this.songPlaying = true;

    // Reset start/end times (start may be in the past)
    let now = Date.now();
    this.songStartTime = now - (this.progressPercentage / 100) * this.songDurationInSeconds * 1000;
    this.songEndsTime = this.songStartTime + this.songDurationInSeconds * 1000;

    // Start the $interval timer
    this.intervalPromise = this.$interval(this.playIntervalCallback, 200);
  }

  pause() {
    this.songPlaying = false;
    if (this.intervalPromise !== null) {
      // Cancel any existing $interval
      this.$interval.cancel(this.intervalPromise);
    }
  }

  stop() {
    if (this.intervalPromise !== null) {
      // Cancel any existing $interval
      this.$interval.cancel(this.intervalPromise);
    }
    this.resetSongTime();
    this.setEmptySongVariables();
  }

  next() {
    let nextSong = this.playlistService.getNextByCurrentSongId(this.currentSong.id);
    if (nextSong === null) {
      this.stop();
      return;
    }

    this.playSong(nextSong);
  }

  prev() {
    let prevSong = this.playlistService.getPreviousByCurrentSongId(this.currentSong.id);
    if (prevSong === null) {
      this.stop();
      return;
    }

    this.playSong(prevSong);
  }

  setEmptySongVariables() {
    this.songPlaying = false;
    this.intervalPromise = null;
  }

  getCurrentSongName() {
    if (this.currentSong == null)
      return '-';

    return this.currentSong.artist_name + ' - ' + this.currentSong.track_title;
  }

  playSong(song) {
    if (song === null) {
      return;
    }

    this.stop();

    this.currentSong = song;
    this.songDurationInSeconds = this.playWidgetHelper.getSongDurationInSeconds(this.currentSong.track_duration);
    this.transitionDuration = this.songDurationInSeconds / 100;
    this.resetSongTime();

    this.play();
  }

  setEmptySong() {
    this.currentSong = null;
    this.songDurationInSeconds = 0;
    this.transitionDuration = 0; // transition time for the progress bar
    this.resetSongTime();
  }

  resetSongTime() {
    this.setElapsedAndRemainingTime(0);
    this.songStartTime = 0;
    this.songEndsTime = 0;
    this.progressPercentage = 0;
    this.playWidgetHelper.resetProgressBarToZero();
  }

  playIntervalCallback() {
    let now = Date.now();
    if (now >= this.songEndsTime) {
      this.next();
      return;
    }

    // Times
    let elapsedSeconds = this.getElapsedSeconds();
    this.setElapsedAndRemainingTime(elapsedSeconds);

    // Progress percentage
    let ratio = (now - this.songStartTime) / (this.songDurationInSeconds * 1000);
    this.progressPercentage = this.playWidgetHelper.getProgressPercentage(ratio);
  }

  getElapsedSeconds() {
    let now = Date.now();
    return Math.round((now - this.songStartTime) / 1000);
  }

  setElapsedAndRemainingTime(elapsedSeconds) {
    // Elapsed
    this.elapsedTime = Math.floor(elapsedSeconds / 60).toString() + ':' +
      (((elapsedSeconds % 60) < 10) ? '0' : '') + (elapsedSeconds % 60).toString();

    // Remaining
    let remainingSeconds = this.songDurationInSeconds - elapsedSeconds;
    this.remainingTime = '-' + Math.floor(remainingSeconds / 60).toString() + ':' +
      (((remainingSeconds % 60) < 10) ? '0' : '') + (remainingSeconds % 60).toString();
  }

  getProgressBarStyle() {
    return {
      width: this.progressPercentage + '%',
      '-webkit-transition-duration': this.transitionDuration + 's',
      'transition-duration': this.transitionDuration + 's'
    };
  }
}

export default angular.module('beatbox.directives.playWidget', [])
  .directive('playWidget', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/play-widget.html',
      controllerAs: 'playWidgetCtrl',
      controller: ['$timeout', '$interval', 'playlistService', 'playWidgetHelper', PlayWidgetController]
    };
  });
