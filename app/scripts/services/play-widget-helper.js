'use strict';

class PlayWidgetHelper {
  getSongDurationInSeconds(trackDuration) {
    let timeList = trackDuration.split(':');
    if (timeList.length > 3)
      return 0;
    let coefficients = [3600, 60, 1];

    let seconds = 0;
    while (timeList.length > 0) {
      seconds += timeList.pop() * coefficients.pop();
    }

    return seconds;
  }

  getProgressPercentage(progress) {
    progress = Math.round(progress * 100);

    if (progress <= 0) {
      progress = 0;
    } else if (progress > 100) {
      progress = 100;
    }

    return progress;
  }

  /**
   * Force the progress bar to width:0% bypassing transition effects
   */
  resetProgressBarToZero() {
    let progressBarEl = angular.element('#play-widget-progress-bar');
    progressBarEl.hide();
    progressBarEl.css('width', '0%');
    progressBarEl[0].offsetHeight; // force the CSS style
    progressBarEl.show();
  }
}

export default angular.module('beatbox.services.playWidgetHelper', [])
  .service('playWidgetHelper', PlayWidgetHelper);
