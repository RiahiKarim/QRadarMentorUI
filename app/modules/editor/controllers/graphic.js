/**
 * @ngdoc controller
 * @name qradarEditor.controller:graphic
 *
 * @description
 *
 * <pre>
 *     <div ng-controller="graphic"></div>
 * </pre>
 */
angular
  .module('qradarEditor')
  .controller('graphic', graphic);

/* @ngInject */
function graphic(backEnd, $http, $scope, selectedComponents, partNumberService, jsonParser,$uibModal) {
  /* jshint validthis: true */
  var vm = this;
  activate();
  vm.components = selectedComponents.components;
  vm.activate = activate;
  vm.families = {};
  vm.maintenanceOptions = {};
  vm.systemZ = false;
  vm.maintenance =
  vm.famiyChanged = function (newFamily, oldFamily) {

    if (!angular.equals({}, vm.components))
      if (confirm("All the components in the current configuration will be deleted."))
        $scope.$broadcast('familyChanged', {"family": newFamily});
      else {
        vm.selectedFamily = angular.fromJson(oldFamily);
      }
    else
      $scope.$broadcast('familyChanged', {"family": newFamily});
  };

  vm.pageSlideOpen = false;

  vm.validateConfig = function () {

    var config = {
      familyName: vm.selectedFamily.name,
      components: vm.components,
      systemZ : vm.systemZ,
      maintenance : []
    };

    if (jsonParser.checkLinks(config.components)) {
      var maintenanceModal = $uibModal.open({
        backdrop: 'static',
        keyboard: false,
        templateUrl: 'modules/editor/views/maintenance-modal.html',
        controller: 'maintenanceModalCtrl',
        resolve: {
          maintenanceOptions: function () {
            return vm.maintenanceOptions;
          }
        }
      });
      maintenanceModal.result.then(function (maintenanceOption) {
        vm.pageSlideOpen = true;
        config.maintenance[0] = maintenanceOption.name;
        partNumberService.getPartNumbers(jsonParser.getConfig(config)).then(function (partNumbers) {
          selectedComponents.setPartNumbers(partNumbers);
        });
      });
    }
  };


  function activate() {
    $http.get(backEnd.url + 'family/all')
      .success(function (families) {
        vm.families = families;
        vm.selectedFamily = _.find(vm.families, {name : "SIEM"});
        if(angular.isUndefined( vm.selectedFamily)) vm.selectedFamily = _.find(vm.families, {name : "Log Manager"});
         if(angular.isUndefined( vm.selectedFamily)) vm.selectedFamily = vm.families[0];
      });
    $http.get(backEnd.url + 'maintenanceOption/all')
      .success(function (maintenanceOptions) {
        vm.maintenanceOptions = maintenanceOptions;
      });
  }

}
