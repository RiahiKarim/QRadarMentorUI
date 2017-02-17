'use strict';
/**
 * @ngdoc controller
 * @name qradarEditor.controller:maintenanceModalCtrl
 *
 * @description
 *
 * <pre>
 *     <div ng-controller="maintenaceModalCtrl"></div>
 * </pre>
 */
angular
  .module('qradarEditor')
  .controller('maintenanceModalCtrl', maintenanceModalCtrl);

/* @ngInject */
function maintenanceModalCtrl($scope, $uibModalInstance, maintenanceOptions) {

  $scope.maintenanceOptions = maintenanceOptions;
  $scope.selected = {
    option : $scope.maintenanceOptions[0]
  };

  $scope.ok = function (maintenanceForm) {
        if (maintenanceForm.$valid)
         $uibModalInstance.close($scope.selected.option);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}
