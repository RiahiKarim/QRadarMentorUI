'use strict';

/**
 * @ngdoc overview
 * @name qradarEditor
 * @description
 *
 * This is the module for qradarEditor , it contains  the different parts of the editor – controllers, services, filters, directives, etc.
 *
 * Dependencies : [ngRoute,ui.bootstrap]
 */
angular
  .module('qradarEditor', [
    'ngRoute',
    'ui.bootstrap',
    'checklist-model',
    'ngScrollbars'
  ]).config(function (ScrollBarsProvider) {
  ScrollBarsProvider.defaults = {
    scrollButtons: {
      enable: true
    },
    scrollbarPosition: "inside",
    scrollInertia: 400,
    axis: 'yx',
    theme: '3d-dark',
    autoHideScrollbar: true
  };
})
  .config(function ($routeProvider) {
    $routeProvider
      .when('/graphic', {
        templateUrl: 'modules/editor/views/graphic.html',
        controller : 'graphic',
        controllerAs : 'vm'
      })
  });
