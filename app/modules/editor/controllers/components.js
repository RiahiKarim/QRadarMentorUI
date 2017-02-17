'use strict';
/**
 * @ngdoc controller
 * @name qradarEditor.controller:componentCtrl
 *
 * @description
 * 
 *
 * <pre>
 *     <div ng-controller="componentCtrl"></div>
 * </pre>
 */
angular
  .module('qradarEditor')
  .controller('componentsCtrl', componentsCtrl);

/* @ngInject */
function componentsCtrl ($scope , componentFetcher) {


    getAllComponents($scope.$parent.vm.selectedFamily.name);

    $scope.$on('familyChanged', function(event, args){

      getAllComponents(args.family.name);
    });

  function getAllComponents(familyName){
    $scope.components = [];
    componentFetcher.getAllComponents(familyName).then(function (components) {
      for(var i in components) {
        if (components.hasOwnProperty(i)) {
          $scope.components.push(components[i]);
        }
      }
    });
  }

}
