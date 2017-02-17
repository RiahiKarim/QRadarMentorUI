'use strict';
/**
 * @ngdoc controller
 * @name qradarEditor.controller:jsonCtrl
 *
 * @description
 *
 * <pre>
 *     <div ng-controller="jsonCtrl"></div>
 * </pre>
 */
angular
  .module('qradarEditor')
  .controller('jsonCtrl',jsonCtrl);

/* @ngInject */
function jsonCtrl ($scope, selectedComponents, jsonParser,partNumberService) {

    $scope.components = selectedComponents.components;

    $scope.getFileResult = function () {
        var results = {config :{
          familyName :"SIEM",
          deploymentMode :"Distributed",
          maintenance : ['Support Reinstatement'],
          systemZ : false,
          chosenProducts: []
        }};


        angular.forEach($scope.components, function (component) {
            var componentResult = component.getOutputFields();

            results.config['chosenProducts'].push(componentResult);
        });

        results = jsonParser.cleanResult(JSON.parse(JSON.stringify(results)));
        results = jsonParser.cleanEmptyObjects(results);
        if (_.isEmpty(results)) {
            results = {};
        }

        return JSON.stringify(results);
    };

    $scope.generateFile = function () {
        var fakeLink = document.createElement('a');

        fakeLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.getFileResult())));
        fakeLink.setAttribute('download', '.qradar.json');
        fakeLink.click();
    };

  $scope.getPartNumbers = function () {
    partNumberService.getPartNumbers(this.getFileResult());
  };
}
