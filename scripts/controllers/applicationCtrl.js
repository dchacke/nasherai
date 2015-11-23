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
          $scope.parsed = acorn.parse(code, { locations: true });
          var variables = {};
          var lineCount;

          $scope.parsed.body.forEach(function (statement) {
            if (statement.type === 'VariableDeclaration') {
              statement.declarations.forEach(function (declaration) {
                if (!variables[declaration.loc.start.line]) {
                  variables[declaration.loc.start.line] = [];
                };

                variables[declaration.loc.start.line].push({
                  name: declaration.id.name,
                  value: declaration.init ? declaration.init.raw : 'undefined'
                });

                lineCount = declaration.loc.start.line;
              });
            }
          });

          $scope.watchables.preview = variables;
          $scope.lineRange = new Array(lineCount);
          delete $scope.error;
        } catch (e) {
          $scope.error = e;
        }
      } else {
        $scope.watchables.preview = {};
        delete $scope.error;
      }
    }, true);
  });
