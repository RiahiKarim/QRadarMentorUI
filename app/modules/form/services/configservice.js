'use strict';

/**
 * @ngdoc service
 * @name qradarForm.configService
 * @description
 * # configService
 * Service in the qradarForm.
 */
angular.module('qradarForm')
  .service('configService', configService);


function configService() {

  var currentFamily ={};
  var currentDeploymentMode = {};
  var currentEntryPoint = {};
  var currentcapacityNeeded = {};
  var sharedProducts = [];
  var localProducts = [];

  function setCurrentFamily(family){
      currentFamily = family
  }

  function getCurrentFamily(){
    return currentFamily;
  }

  function setCurrentDeploymentMode(deploymentMode){
    currentDeploymentMode = deploymentMode ;
  }

  function getCurrentDeploymentMode(){
    return currentDeploymentMode;
  }

  function setCurrentEntryPoint(entryPoint){
    currentEntryPoint = entryPoint;
  }

  function getCurrentEntryPoint(){
    return  currentEntryPoint ;
  }

  function setCapacityNeeded(sites){
    var capacityNeeded = {};
    //sum the capacity needed for a property , exple : EPS or FPM
    currentFamily.properties.forEach(function(property) {
      var sumProperty = 0 ;
      sites.forEach(function (site) {
        sumProperty += (parseFloat(site.siteProperties[property]) || 0);

      });
      capacityNeeded[property] = sumProperty;
    });
    currentcapacityNeeded = capacityNeeded;
  }

  function getCapacityNeeded(){
    return currentcapacityNeeded;
  }


  function deployementModeCanSupportCapacityNeeded(){
    var supported = true;
    Object.keys(currentcapacityNeeded).forEach(function(property){
      supported = supported && (currentcapacityNeeded[property] <= currentDeploymentMode.maxCapacity[property]);
    });
    return supported;
  }


  function setSharedProductWhenDmChange(products){
    sharedProducts = products.concat(currentEntryPoint);
  }


  function getSharedProductWhenDmChange(){
    return sharedProducts;
  }


  return {
    setCurrenFamily : setCurrentFamily,
    getCurrenFamily : getCurrentFamily,
    setCurrenDM : setCurrentDeploymentMode,
    getCurrenDM : getCurrentDeploymentMode,
    setCurrenEP : setCurrentEntryPoint,
    getCurrenEP : getCurrentEntryPoint,
    setCapacityNeeded : setCapacityNeeded,
    getCapacityNeeded : getCapacityNeeded,
    dmCanSupportNeeds : deployementModeCanSupportCapacityNeeded,
    setSharedProduct : setSharedProductWhenDmChange,
    getSharedProduct : getSharedProductWhenDmChange
  }

}
