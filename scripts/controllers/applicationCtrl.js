var acorn = require('acorn');
var walk = require('./node_modules/acorn/dist/walk.js');
var walkall = require('./node_modules/walkall/walkall.js');
var objectDiff = require('objectdiff');
var jshint = require('jshint').JSHINT;

angular.module('nasherai')
  .controller('ApplicationCtrl', function ($scope) {
    $scope.watchables = {
      code: ''
    };

    $scope.$on('new:line', function (event, lineNumber, variables) {
      var newLine = {
        number: lineNumber,
        variables: angular.copy(variables)
      };

      // Determine diff to previous line
      if ($scope.lines.length === 0) {
        // If no lines, everything is new
        newLine.changes = angular.copy(variables);
      } else {
        // If there is at least one previous line, diff the new one with it
        var diff = objectDiff.diff($scope.lines[$scope.lines.length - 1].variables, newLine.variables);

        if (diff.changed === 'object change') {
          newLine.changes = {};

          for (var variable in diff.value) {
            if (diff.value.hasOwnProperty(variable)) {
              if (diff.value[variable].changed !== 'equal' && diff.value[variable].changed !== 'removed') {
                newLine.changes[variable] = angular.copy(variables[variable]);
              }
            }
          }
        }
      }

      $scope.lines.push(newLine);

      $scope.lineRange = new Array($scope.lines.length);
    });

    $scope.$watch(function () {
      return $scope.watchables.code;
    }, function (code) {
      $scope.line = 0;
      $scope.lines = [];
      $scope.variables = {};
      delete $scope.errors;
      delete $scope.firstError;

      if (code) {
        jshint(code);
        $scope.errors = jshint.errors;

        if ($scope.errors.length) {
          $scope.firstError = $scope.errors[0];
        } else {
          delete $scope.firstError;
        }

        try {
          var parsed = acorn.parse(code, { locations: true, ranges: true });

          walk.simple(parsed, walkall.makeVisitors(function (node) {
            if (node.type === 'VariableDeclarator') {
              $scope.variables[node.id.name] = undefined;
            }
          }), walkall.traversers);

          var lines = code.split('\n');

          for (var i = 0; i < lines.length; i++) {
            lines[i] += ('\n$scope.$broadcast("new:line", ' + i + ', $scope.variables);\n');
          }

          code = lines.join('\n');

          with ($scope.variables) {
            eval(code);
          }

          delete $scope.error;
        } catch (e) {
          $scope.error = e;
        }
      }
    }, true);
  });
