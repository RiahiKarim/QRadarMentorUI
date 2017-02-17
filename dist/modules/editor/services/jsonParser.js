'use strict';
/**
 * @ngdoc service
 * @name qradarEditor.service:jsonParser
 *
 * @description
 *
 */

angular
  .module('qradarEditor')
  .service('jsonParser', jsonParser);

    function jsonParser(toastr) {



    function checkLinksBetweenComponents(components){
      var valide = true;
      angular.forEach(components, function (component) {
        //check the element that must be connected to another one
        if(component.linkedTo.length !=0){
          if(component.links.length==0){
            toastr.warning(component.name+' doit être lié avec :'+toString(_.uniq(component.linkedTo)), 'Warning');
            valide = false;
          }
        }
      });
      return valide;
    }
      function toString(elements){
        var string = ' ';

        elements.forEach(function(element, idx, array){

          if (idx === array.length - 1){
            string += element + '.';
          }
          else{
            string += element + ', ';
          }
        });
        angular.forEach(elements, function (element) {
        });
        return string;
      }

    function getConfig(config) {

      var results = {
        Config: {
          familyName: config.familyName,
          maintenance: config.maintenance,
          systemZ: config.systemZ,
          chosenProducts: []
        }
      };

      angular.forEach(config.components, function (component) {
        var componentResult = component.getOutputFields();
        results.Config['chosenProducts'].push(componentResult);
      });

      return results;
    }

    /**
     * Remove empty objects recursively from another object
     *
     * @param {Object} object
     * @returns {Object}
     */
    function cleanEmptyObjects(object) {
      if (_.isEmpty(object)) {
        return '';
      }

      for (var prop in object) {
        if (!object.hasOwnProperty(prop) || typeof object[prop] !== 'object') {
          continue;
        }

        if (prop === 'common') {
          delete object[prop];
          continue;
        }

        object[prop] = cleanEmptyObjects(object[prop]);
        if (_.isEmpty(object[prop])) {
          delete object[prop];
        }
      }

      return object;
    }

    function cleanResult(object) {
      for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
          continue;
        }

        // Remove  empty string
        if (object[prop] === '') {
          delete object[prop];
          continue;
        }

        if (typeof object[prop] === 'object') {
          object[prop] = cleanResult(object[prop]);
        }
      }

      return object;
    }

    return {
      getConfig: getConfig,
      checkLinks : checkLinksBetweenComponents
    };
  }
