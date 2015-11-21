angular.module('nasherai')
  .controller('ApplicationCtrl', function ($scope) {
    $scope.watchables = {
      code: 'Code goes hereee!',
      preview: 'Preview'
    };

    $scope.$watch(function () {
      return $scope.watchables.code;
    }, function (code) {
      console.log('code', code);
    }, true);

    $scope.$watch(function () {
      return $scope.watchables.preview;
    }, function (preview) {
      console.log('preview', preview);
    }, true);
  });
