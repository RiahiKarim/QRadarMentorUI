'use strict';
/**
 * @ngdoc controller
 * @name qradarEditor.controller:editComponentCtrl
 *
 * @description
 *
 * <pre>
 *     <div ng-controller="editComponentCtrl"></div>
 * </pre>
 */
angular
  .module('qradarEditor')
  .controller('editComponentCtrl', editComponentCtrl);

/* @ngInject */
function editComponentCtrl($scope, $uibModalInstance, selectedComponents, componentFetcher, values, $http, backEnd) {

  var allComponents = {};

  componentFetcher.getAllComponents(values.familyName).then(function (components) {

    allComponents = components;

    // Inject fields types
    $scope.fields = {
      properties: allComponents[values.type].property || [],
      ranges: allComponents[values.type].ranges || []
    };
    // Inject fields values
    $scope.componentNames = Object.keys(selectedComponents.components);
    $scope.values = values;
    getSupportOptions();
  });

  $scope.getSupportOptionsWhenProductChanges = function () {
    $scope.values.supportOptions = [];
    getSupportOptions();
  };

  function getSupportOptions() {
    if ($scope.values.range)
      $http.get(backEnd.url + 'supportOption/get?type=' + $scope.values.range.type + '&family=SIEM')
        .success(function (supportOptions) {
          $scope.fields.supportOptions = supportOptions;
        });
  }

  $scope.hasPrequisite = function (prerequisites) {
    if (prerequisites != null) {
      if (values.supportOptions.length > 0) {
        return typeof  _.find(values.supportOptions, {'key': prerequisites[0]}) === 'undefined';
      }
      return true;
    }
    return false;
  };
  $scope.uncheck = function (value, checked) {
    angular.forEach (_.filter($scope.values.supportOptions, function (optionsThatHavePrerequisite) {
        return _.has(optionsThatHavePrerequisite, 'prerequisite');
      })
      , function (optionThatNeedsPrerequisites) {
        if(_.includes(optionThatNeedsPrerequisites.prerequisite,value.key) && checked == false){

          $scope.values.supportOptions = _.without(values.supportOptions,optionThatNeedsPrerequisites,value);

        }
      });

  };

  $scope.ok = function (detailForm) {
    if (detailForm.$valid)
      $uibModalInstance.close({name: $scope.values.name, values: $scope.values});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}
