'use strict';

/**
 * @ngdoc function
 * @name qradarForm.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the qradarForm
 */
angular
  .module('qradarForm')
  //Clean Code : Named Fonctions are better than anonymous ones
  .controller('MainCtrl', MainCtrl);

/* @ngInject */ //Dependency Injection  to prevent errors when minimify the projectgr
function MainCtrl($scope, formlyBuilder, configService,toastr) {

  var counter = 0 ;
  var vm = this;

  vm.model = { };
  vm.fields = formlyBuilder.createForm(vm);
  vm.onSubmit = onSubmit;

  $scope.$on('compareCapcityNeededwithDm', function () {
    $scope.$broadcast("dmChanged");

    if (vm.model.sites && !angular.equals({}, configService.getCurrenDM())) {
      //store the needed capacity by the user
      configService.setCapacityNeeded(vm.model.sites);
      //check if the deployementMoed has a Max Capacity
      if (angular.equals({}, configService.getCurrenDM().maxCapacity)) {
        vm.error = "";
      }
      else {
        //check if the deployement mode support the needs
        if (configService.dmCanSupportNeeds()) {
          vm.error = "";
        }
        else
          toastr.info('Le mode de deploiement ne supporte pas la capcité requise');

      }
    }
  });

  function onSubmit() {


  }

}
