'use strict';

class SongRatingController {
  constructor($log, $scope) {
    this.$log = $log;
    this.$scope = $scope;

    this.fixedRating = false;
    this.rating = 3;
  }

  rate(songId) {
    if (this.fixedRating === true) {
      return;
    }
    this.fixedRating = true;
    this.$log.info('Rated song #' + this.$scope.songId + ' with ' + this.rating);
  }

  plus() {
    if (this.rating < 5 && this.fixedRating === false) {
      this.rating += 0.5;
    }
  }

  minus() {
    if (this.rating > 0 && this.fixedRating === false) {
      this.rating -= 0.5;
    }
  }
}

export default angular.module('beatbox.directives.songRating', [])
  .directive('songRating', function () {
    return {
      restrict: 'A',
      scope: {
        songId: '='
      },
      templateUrl: 'views/song-rating.html',
      controllerAs: 'songRatingCtrl',
      controller: ['$log', '$scope', SongRatingController]
    };
  });
