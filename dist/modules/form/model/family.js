'use strict';

/**
 * @ngdoc service
 * @name qradarForm.family
 * @description
 * # family
 * Factory in the qradarForm.
 */
angular.module('qradarForm')
  .factory('Family', Family);

  /* @ngInject */
  function Family ($http) {
  //.factory('familyService', function ($http) {
    // Service logic
    // ...


    function Family(familyData) {
      if (familyData) {
        this.setData(familyData);
      }
      // Some other initializations related to family
    }
    Family.prototype = {
      setData: function(familyData) {
        angular.extend(this, familyData);
      }
    };
    return Family;
  }
