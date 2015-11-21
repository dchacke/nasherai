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
      code = String(code).replace(/<[^>]+>|&nbsp;/gm, '');

      try {
        esprima.parse(code);
        delete $scope.error;
      } catch (e) {
        $scope.error = e;
      }
    }, true);
  });
