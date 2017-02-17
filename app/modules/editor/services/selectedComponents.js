'use strict';
/**
 * @ngdoc service 
 * @name qradarEditor.service:selectedComponents 
 *
 * @description
 *
 */
angular
  .module('qradarEditor')
  .service('selectedComponents', function () {


    this.components = {};

    this.setPartNumbers = function (partNumbers) {

      angular.forEach(this.components, function (component) {
        component.partNumbers = {
          product :[],
          capacityIncrease :[],
          formatedCapacityIncreases :[]
        };
        angular.forEach(partNumbers[component.name], function (partNumber) {
            component.partNumbers[partNumber.partNumberType].push(partNumber);
        });

        angular.forEach(_.countBy(component.partNumbers.capacityIncrease,'partNumber'), function (value,key) {

          component.partNumbers.formatedCapacityIncreases.push({
            times : value ,
            capacityIncrease : _.find(component.partNumbers.capacityIncrease, {'partNumber' : key })
          }
          )
        });

      })
    };
    /**
     * Return a name available for a component
     *
     * @param {String} type
     * @returns {String}
     */
    this.getElementName = function (type) {
      //type = type.replace('-', '_');
      if (this.components[type] === undefined) {
        return type;
      }

      var parts = type.split('_'),
        nbParts = parts.length,
        newName;

      if (nbParts > 1 && parseInt(parts[nbParts - 1], 10) > 0) {
        newName = parts.slice(0, nbParts - 1).join('_') + '_' + (Number(parts[nbParts - 1]) + 1);
      } else {
        newName = type + '_' + 1;
      }
      return this.getElementName(newName);
    };
  });
