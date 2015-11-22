var acorn = require('acorn');

angular.module('nasherai')
  .controller('ApplicationCtrl', function ($scope) {
    $scope.watchables = {
      code: '',
      preview: ''
    };

    $scope.$watch(function () {
      return $scope.watchables.code;
    }, function (code) {
      if (code) {
        try {
          acorn.parse(code, { locations: true });
          delete $scope.error;
        } catch (e) {
          $scope.error = e;
        }
      } else {
        delete $scope.error;
      }
    }, true);
  });
