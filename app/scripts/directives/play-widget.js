'use strict';

class PlayWidgetController {
  constructor($timeout, $interval, playlistService) {
    this.$timeout = $timeout;
    this.$interval = $interval;
    this.playlistService = playlistService;

    // Current song properties
    this.setEmptySong();
    this.setEmptySongVariables();
    this.playIntervalCallback = this.playIntervalCallback.bind(this);
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
    this.stopPlaying();
    this.setSong(song);
    this.startPlaying();
  }

  setSong(song) {
    this.currentSong = song;
    this.songDurationInSeconds = this.getSongDurationInSeconds();
    this.transitionDuration = this.songDurationInSeconds / 100;
    this.resetSongTime();
  }

  setEmptySong() {
    this.currentSong = null;
    this.songDurationInSeconds = 0;
    this.transitionDuration = 0; // transition time for the progress bar
    this.resetSongTime();
  }

  resetSongTime() {
    this.elapsedTime = '0:00';
    if (this.currentSong === null) {
      this.remainingTime = '-0:00';
    } else {
      this.setRemainingTimeByElapsedSeconds(0);
    }
    this.songStartTime = 0;
    this.songEndsTime = 0;
    this.progressPercentage = 0;
    this.resetProgressBarToZero();
  }

  startPlaying() {
    if (this.currentSong === null)
      return;

    this.songPlaying = true;

    let now = Date.now();
    this.songStartTime = now - (this.progressPercentage / 100) * this.songDurationInSeconds * 1000;
    this.songEndsTime = this.songStartTime + this.songDurationInSeconds * 1000;

    this.intervalPromise = this.$interval(this.playIntervalCallback, 200);
  }

  pausePlaying() {
    this.songPlaying = false;
    if (this.intervalPromise !== null) {
      // Cancel any existing $interval
      this.$interval.cancel(this.intervalPromise);
    }
  }

  stopPlaying() {
    if (this.intervalPromise !== null) {
      // Cancel any existing $interval
      this.$interval.cancel(this.intervalPromise);
    }
    this.resetSongTime();
    this.setEmptySongVariables();
  }

  playIntervalCallback() {
    let now = Date.now();
    if (now >= this.songEndsTime) {
      this.stopPlaying();
      return;
    }

    // Times
    let elapsedSeconds = this.setElapsedTime();
    this.setRemainingTimeByElapsedSeconds(elapsedSeconds);

    // Progress percentage
    let ratio = (now - this.songStartTime) / (this.songDurationInSeconds * 1000);
    this.setProgressPercentage(ratio);
  }

  getSongDurationInSeconds() {
    let timeList = this.currentSong.track_duration.split(':');
    if (timeList.length > 3)
      return 0;
    let coefficients = [3600, 60, 1];

    let seconds = 0;
    while (timeList.length > 0) {
      seconds += timeList.pop() * coefficients.pop();
    }

    return seconds;
  }

  setElapsedTime() {
    let now = Date.now();
    let elapsedSeconds = Math.round((now - this.songStartTime) / 1000);
    this.elapsedTime = Math.floor(elapsedSeconds / 60).toString() + ':' +
      (((elapsedSeconds % 60) < 10) ? '0' : '') + (elapsedSeconds % 60).toString();
    return elapsedSeconds;
  }

  setRemainingTimeByElapsedSeconds(elapsedSeconds) {
    let remainingSeconds = this.songDurationInSeconds - elapsedSeconds;
    this.remainingTime = '-' + Math.floor(remainingSeconds / 60).toString() + ':' +
      (((remainingSeconds % 60) < 10) ? '0' : '') + (remainingSeconds % 60).toString();
  }

  setProgressPercentage(progress) {
    progress = Math.round(progress * 100);

    if (progress <= 0) {
      progress = 0;
    } else if (progress > 100) {
      progress = 100;
    }

    this.progressPercentage = progress;
  }

  getProgressBarStyle() {
    return {
      width: this.progressPercentage + '%',
      '-webkit-transition-duration': this.transitionDuration + 's',
      'transition-duration': this.transitionDuration + 's'
    };
  }

  resetProgressBarToZero() {
    let progressBarEl = angular.element('#play-widget-progress-bar');
    progressBarEl.hide();
    progressBarEl.css('width', '0%');
    progressBarEl[0].offsetHeight; // force the CSS style
    progressBarEl.show();
  }
}

export default angular.module('beatbox.directives.playWidget', [])
  .directive('playWidget', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/play-widget.html',
      controllerAs: 'playWidgetCtrl',
      controller: ['$timeout', '$interval', 'playlistService', PlayWidgetController]
    };
  });
