'use strict';

/**
 * @ngdoc function
 * @name qradarForm.controller:RepeatsitecontrollerCtrl
 * @description
 * # RepeatsitecontrollerCtrl
 * Controller of the qradarForm
 */
angular.module('qradarForm')
  .controller('RepeatSiteCtrl', RepeatSiteCtrl);


function RepeatSiteCtrl($scope,configService) {
  var unique = 1;
  var site = 0
  $scope.formOptions = {formState: $scope.formState};
  $scope.addSite = addSite;
  $scope.copyFields = copyFields;
  $scope.removeSite = removeSite;

  initSite();

  function copyFields(fields) {
    fields = angular.copy(fields);
    fields[1].fieldGroup[0].templateOptions.options = [];
    addRandomIds(fields);
    return fields;
  }

  function addSite() {
    $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
    var repeatsection = $scope.model[$scope.options.key];
    var newsection = {};
    newsection["id"] = site++;
    repeatsection.push(newsection);
  }

  function removeSite(index){
    $scope.model[$scope.options.key].splice(index, 1);
    $scope.$emit('compareCapcityNeededwithDm');
  }

  function addRandomIds(fields) {
    unique++;
    angular.forEach(fields, function(field, index) {
      if (field.fieldGroup) {
        addRandomIds(field.fieldGroup);
        return;
      }

      if (field.templateOptions && field.templateOptions.fields) {
        addRandomIds(field.templateOptions.fields);
      }

      field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
    });
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //Add site properties (EPS , FPM ...)
  function initSite(){

    var sitePrpertiesFiels = [];
    configService.getCurrenFamily().properties.forEach(function (siteProperty) {
      sitePrpertiesFiels.push({
        className: 'flex-1',
        type: 'input',
        key: siteProperty,
        defaultValue: 0,
        templateOptions: {
          label: siteProperty,
          type: 'number',
          required: true,
          //if site properties changes we check if the deployement can support it
          onChange: function ($viewValue, $modelValue, $scope) {
            $scope.$emit('compareCapcityNeededwithDm');
          }
        }
      });
    });

    $scope.to.fields[0].fieldGroup = sitePrpertiesFiels;
  }
}
