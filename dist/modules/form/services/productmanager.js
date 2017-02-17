'use strict';

/**
 * @ngdoc service
 * @name qradarForm.productManager
 * @description
 * # productManager
 * Service in the qradarForm.
 */
angular.module('qradarForm')
  .factory('productManager', productManager );

/* @ngInject */
function productManager ($http, $q, backEnd) {

  return  {
    getConnectedProducts: function(familyName,productName) {

      var deferred = $q.defer();
      if (productName) {
        $http.get(backEnd.url+'product/connectedProducts', {
            params: {
              familyName: familyName,
              productName: productName
            }
          })
          .success(function (connectedProducts, status, headers, config) {
            deferred.resolve(connectedProducts);
          })
          .error(function (productData, status, headers, config) {
            deferred.reject();
          });
        return deferred.promise;
      }

    },
    //fetch all ranges for a product and family
    getConnectedRanges: function(familyName, product,siteProperties) {
      var data = {};

      if(product.property){
        product.property.forEach(function(property){
          data[property] = siteProperties[property] ;
        });
      }

      var deferred = $q.defer();

        $http.post(backEnd.url+'product/connectedRanges?familyName='+familyName+'&productName='+product.name )
          .success(function (connectedRanges, status, headers, config) {
            deferred.resolve(connectedRanges);
          })
          .error(function (productData, status, headers, config) {
            deferred.reject();
          });
      return deferred.promise;
    }
  }
}

