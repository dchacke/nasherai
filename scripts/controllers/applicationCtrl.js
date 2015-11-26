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

    var lastExecution;

    $scope.$on('new:line', function (event, lineNumber, variables) {
      var currentExecution = {
        variables: angular.copy(variables)
      };

      // Have variables been changed before?
      if (lastExecution) {
        // Determine diff to last execution
        var diff = objectDiff.diff(lastExecution.variables, currentExecution.variables);

        if (diff.changed === 'object change') {
          currentExecution.changes = {};

          for (var variable in diff.value) {
            if (diff.value.hasOwnProperty(variable)) {
              if (diff.value[variable].changed !== 'equal' && diff.value[variable].changed !== 'removed') {
                currentExecution.changes[variable] = angular.copy(variables[variable]);
              }
            }
          }
        }
      // This is the first line's first execution, so everything is new
      } else {
        currentExecution.changes = currentExecution.variables;
      }

      // If something changed in the current execution...
      if (currentExecution.changes) {
        // Mark it as the last execution
        lastExecution = currentExecution;

        // Prepare an array for this new line's executions if there isn't one
        if (!$scope.lines[lineNumber]) {
          $scope.lines[lineNumber] = [];
        }

        // Push it into the current line's executions
        $scope.lines[lineNumber].push(currentExecution);
      }

      // Keep track of how many lines there are, i.e. the maximum line
      // number + 1
      var lineNumbers = Object.keys($scope.lines);

      // Object.keys returns strings, even though the keys are integers,
      // so we need to convert them back to integers
      lineNumbers = lineNumbers.map(function (lineNumber) {
        return parseInt(lineNumber);
      });

      lineNumbers.sort(function (a, b) {
        return a - b;
      });

      var maxLineNumber = parseInt(lineNumbers[lineNumbers.length - 1]);
      $scope.lineRange = new Array(maxLineNumber + 1);
    });

    $scope.$watch(function () {
      return $scope.watchables.code;
    }, function (code) {
      $scope.line = 0;
      $scope.lines = {};
      $scope.variables = {};
      delete $scope.errors;
      delete $scope.firstError;
      lastExecution = undefined;

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
          // console.log(code);

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
