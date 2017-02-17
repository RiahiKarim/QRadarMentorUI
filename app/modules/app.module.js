'use strict';

/**
 * @ngdoc overview
 * @name qradar
 * @description
 *
 * This is the module for qradar, it contains qradarEditor module and qradarForm module
 */
angular
  .module('qradar', [
    'qradarHome',
    'qradarForm',
    'qradarEditor',
    'angular-loading-bar',
    'ngAnimate',
    'toastr',
    'pageslide-directive'
  ]).config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: false,
    maxOpened: 5,
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventOpenDuplicates: true,
    timeOut: 10000,
    extendedTimeOut: 1000000000,
    tapToDismiss: false,
    closeButton: true
  });
}).filter('trim', function () {
  return function(value) {
    if(!angular.isString(value)) {
      return value;
    }
    return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
  };
}).constant("backEnd", {
   "url": "http://169.44.118.214/api/"
});
