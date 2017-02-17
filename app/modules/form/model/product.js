'use strict';

/**
 * @ngdoc service
 * @name qradarForm.product
 * @description
 * # product
 * Factory in the qradarForm.
 */
angular.module('qradarForm')
  .factory('Product', Product);

/* @ngInject */
function Product ($http) {
  //.factory('productService', function ($http) {
  // Service logic
  // ...

  function Product(productData) {
    if (productData) {
      this.setData(productData);
    }
    // Some other initializations
  }
  Product.prototype = {
    setData: function(productData) {
      angular.extend(this, productData);
    },


  };
  return Product;
}

