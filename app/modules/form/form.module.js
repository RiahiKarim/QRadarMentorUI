'use strict';

/**
 * @ngdoc overview
 * @name qradarForm
 * @description
 * # qradarForm
 *
 * Form module of the application.
 */
/* @ngInject */
angular
  .module('qradarForm', [
    'ngRoute',
    'formly',
    'formlyBootstrap',
    'ngAnimate',
    'ngMessages',
    'ui.grid',
    'ui.bootstrap',
    'ui.grid.autoResize',
    'ui.grid.selection',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.validate',
    'ui.grid.resizeColumns'
  ])

  .config(function config(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'repeatSite',
      templateUrl: 'modules/form/views/site.html',
      controller: 'RepeatSiteCtrl'
    });
    formlyConfigProvider.setType({
      name: 'repeatProduct',
      templateUrl: 'modules/form/views/repeatProduct.html',
      controller: 'RepeatProductCtrl'

    });
    formlyConfigProvider.setType({
      name: 'ui-grid',
      templateUrl: 'modules/form/views/productsGrid.html',
      controller: 'ProductsGridCtrl',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'add-product',
      template:  '<button style="margin: 0px ;" type="button" ng-disabled="disable()" class="btn btn-primary"  ng-click="add()">Ajouter</button>',
      controller: 'AddProductCtrl'
    });
    formlyConfigProvider.setWrapper({
      name: 'panel',
      templateUrl: 'modules/form/views/sites.html'
    });

    formlyConfigProvider.setWrapper([
      {
        name: 'validation',
        types: ['input','select'],
        templateUrl: 'modules/form/views/templates/error-messages.html'
      }
    ]);

  })

  .run(function run(formlyConfig,formlyValidationMessages) {
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyValidationMessages.addStringMessage('required', 'ce champ est obligatoire');
    formlyValidationMessages.addStringMessage('min', 'should be greater than 0');
    formlyValidationMessages.addStringMessage('number', 'Invalid Input');
    formlyValidationMessages.addTemplateOptionValueMessage('max', 'max', 'The max value allowed is', '', 'Too big');
    formlyValidationMessages.addTemplateOptionValueMessage('pattern', 'patternValidationMessage', '', '', 'Invalid Input');
  })


  .config(function ($routeProvider) {
    $routeProvider
      .when('/form', {
        templateUrl: 'modules/form/views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      });
  });
