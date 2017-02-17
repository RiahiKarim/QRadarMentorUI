'use strict';

/**
 * @ngdoc function
 * @name qradarForm.controller:RepeatproductctrlCtrl
 * @description
 * # RepeatproductctrlCtrl
 * Controller of the qradarForm
 */
angular.module('qradarForm')
  .controller('RepeatProductCtrl', RepeatProductCtrl );


function RepeatProductCtrl($scope) {

  var unique = 1;
  $scope.formOptions = {formState: $scope.formState};
  $scope.addProduct = addProduct;
  $scope.copyFields = copyFields;
  $scope.removeProduct = removeProduct;

  function copyFields(fields) {
    fields = angular.copy(fields);
    addRandomIds(fields);
    return fields;
  }

  function addProduct() {
    $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
    var repeatsection = $scope.model[$scope.options.key];
    var newsection = {};
    repeatsection.push(newsection);
  }

  function removeProduct(index){
    $scope.model[$scope.options.key].splice(index, 1);
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


  }
