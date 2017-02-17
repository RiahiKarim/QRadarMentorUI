'use strict';

/**
 * @ngdoc overview
 * @name qradarHome
 * @description
 *
 * This is the module for qradarHome
 */
angular
  .module('qradarHome', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/home/home.html',
      })
  });
