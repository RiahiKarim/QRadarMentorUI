'use strict';

/**
 * @ngdoc service
 * @name qradarForm.productType
 * @description
 * # family
 * Factory in the qradarForm.
 */
angular.module('qradarForm')
  .factory('productType', productType);

/* @ngInject */
function productType () {

  function ProductType(typeData) {
    if (typeData) {
      this.setData(typeData);
    }
    // Some other initializations related to family
  }
  ProductType.prototype = {
    setData: function(typeData) {
      angular.extend(this, typeData);
    }


  };
  return ProductType;
}
