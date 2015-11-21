var esprima = require('esprima');

angular.module('nasherai')
  .controller('ApplicationCtrl', function ($scope) {
    $scope.watchables = {
      code: '',
      preview: ''
    };

    $scope.$watch(function () {
      return $scope.watchables.code;
    }, function (code) {
      try {
        esprima.parse(code);
        delete $scope.error;
      } catch (e) {
        $scope.error = e;
      }
    }, true);
  });
