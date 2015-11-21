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
      eval(code);
    }, true);
  });
