'use strict';

/**
 * @ngdoc function
 * @name qradarForm.controller:AddProductCtrl
 * @description
 * # AddProductCtrl
 * Controller of the qradarForm
 */
angular.module('qradarForm')
  .controller('AddProductCtrl', AddProductCtrl);

/* @ngInject */
function  AddProductCtrl($scope,configService, productManager) {

  $scope.disable =  function(){
    if($scope.model.range && !angular.equals($scope.model.product, configService.getCurrenEP())){
      if(!angular.equals($scope.model.range.maxCapacity,{})){
        return !compareChoosenWithMaxCapacity($scope.model.range.maxCapacity,$scope.model.choosenCapacity);
      }
      else
        return false;
    }
    };

  function compareChoosenWithMaxCapacity (maxCapacity,choosenCapacity){
    var supported = true;
    Object.keys(maxCapacity).forEach(function(property){
      supported = supported && (choosenCapacity[property] <= maxCapacity[property]);
    });
    return supported;
  }
  $scope.add = function () {

    if ($scope.model.product.occurence != 0) {
      $scope.model.products
        .push(
          {
            product: $scope.model.product.name,
            type: $scope.model.range.type,
            range: $scope.model.range.name,
            choosenEPS: $scope.model.choosenCapacity.EPS  ,
            choosenFPM: $scope.model.choosenCapacity.FPM
            //TODO test purposes
            //HDR: false,
            //FF: false
          }
        );
      if ($scope.model.product.occurence != "n")
        $scope.model.product.occurence = $scope.model.product.occurence - 1;

      //Add product that can be connected to the  added product
      productManager.getConnectedProducts(configService.getCurrenFamily().name, $scope.model.product.name)
        .then(function (products) {
          var productToAdd = [];
          products.forEach(function (product) {
            var exist = false;
            $scope.fields[0].templateOptions.options.forEach(function (extingProduct) {
              if (extingProduct.name == product.name)
                exist = true;
            });
            if (!exist)
              productToAdd.push(product);
          });

          $scope.fields[0].templateOptions.options = $scope.fields[0].templateOptions.options.concat(productToAdd);
        });
      //clear the fields
      delete $scope.model.product;
      delete $scope.model.range;
      delete $scope.model.choosenCapacity;
      $scope.fields[1].templateOptions.options = [];
    }
  }
}
