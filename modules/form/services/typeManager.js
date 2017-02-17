'use strict';

/**
 * @ngdoc service
 * @name qradarForm.typeManager
 * @description
 * # typeManager
 * Service in the qradarForm.
 */
angular.module('qradarForm')
  .factory('typeManager', typeManager );

/* @ngInject */
function typeManager ($http, $q,productType) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  return {
    _pool: {},
    //////////////////////////////////////
    _retrieveInstance: function(typeName, typeData) {
      var instance = this._pool[typeName];

      if (instance) {
        instance.setData(typeData);
      } else {
        instance = new productType(typeData);
        this._pool[typeName] = instance;
      }
      return instance;
    },

    /* Use this function in order to get instances of all the offering types */
    loadAllTypes: function() {

      var deferred = $q.defer();
      var scope = this;
      $http.get('http://192.168.99.100:9002/api/productType/types')
        .success(function(typesArray) {
          var types = [];
          typesArray.forEach(function(typeData) {
            var productType = scope._retrieveInstance(typeData.name, typeData);
            types.push(productType);
          });

          deferred.resolve(types);
        })
        .error(function() {
          deferred.reject();
        });
      return deferred.promise;
    }
  }
}
