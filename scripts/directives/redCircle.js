angular.module('nasherai')
  .directive('redCircle', function () {
    return {
      restrict: 'E',
      template: '<div class="red-circle"></div>',
      replace: true,
      scope: {
        error: '='
      },
      link: function (scope, element, attrs) {
        scope.$watch(function () {
          return scope.error;
        }, function (error) {
          if (error) {
            var top = (error.line - 1) * 20 + 6;
            element.css('top', top + 'px');
          }
        }, true);
      }
    };
  });
