'use strict';

/**
 * @ngdoc function
 * @name qradarForm.controller:ProductsgridctrlCtrl
 * @description
 * # ProductsgridctrlCtrl
 * Controller of the qradarForm
 */
angular.module('qradarForm')
  .controller('ProductsGridCtrl', ProductsGridCtrl);

  function ProductsGridCtrl($scope) {

          $scope.gridOptions = {
            data: $scope.model[$scope.options.key],
            columnDefs: $scope.to.columnDefs,
            onRegisterApi: $scope.to.onRegisterApi,
            enableSoting: false,
            enableColumnMenus: false,
            enableColumnResizing: true,
            showSelectionCheckbox: true,
            minRowsToShow : 3
          };
    console.log($scope);

          $scope.deleteRow = function(row){
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index,1);
          }



  }
