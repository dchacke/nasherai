angular.module('nasherai')
  .directive('redCircle', function () {
    return {
      restrict: 'E',
      template: '<div id="red-circle"></div>',
      replace: true,
      link: function (scope, element, attrs) {
        scope.$watch(function () {
          return scope.error;
        }, function (error) {
          if (error) {
            var marginTop = (error.loc.line - 1) * 20 + 6;
            element.css('margin-top', marginTop + 'px');
          }
        }, true);
      }
    };
  });
