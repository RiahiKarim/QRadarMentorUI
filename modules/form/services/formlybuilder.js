'use strict';

/**
 * @ngdoc service
 * @name qradarForm.formlyBuilder
 * @description
 * # formlyBuilder
 * Factory in the qradarForm.
 */

// this service will return a Formly form object
// the model must be  initialized in the controller
angular.module('qradarForm')
  .factory('formlyBuilder', formlyBuilder);

/* @ngInject */
function formlyBuilder(familyManager, productManager, configService) {

  return {

    createForm: function (vm) {
      //Fields [
      // 0 -> family ,
      // 1 -> deploymentMode depends on [family]
      // 2-> sites depends on [family properties , deployementMode]
      //]
      return [
        {
          key: 'family',
          type: 'select',
          templateOptions: {
            label: 'Famille',
            options: [],
            ngOptions: 'family as family.name for family in to.options',
            required: true,
            //if the selected family change
            onChange: /* @ngInject */  function (selectedFamily) {
              //clear deployement modes and sites from the model
              //Because site properties and deployment mode depends on family
              delete vm.model.sites;
              delete vm.model.deploymentMode;
              if (selectedFamily) {
                configService.setCurrenFamily(selectedFamily);
                //reload deployment modes for the selected family
                familyManager.getDeployementModes(selectedFamily.name).then(function (res) {
                  vm.fields[1].templateOptions.options = res;
                });
              }
            }
          },
          controller: /* @ngInject */ function ($scope) {
            //load families (SIEM, Log Manager ) from the server
            $scope.to.loading = familyManager.loadAllFamilies().then(function (families) {
              $scope.to.options = families;
              return families;
            });
          }
        },
        {
          key: 'deploymentMode',
          type: 'select',
          templateOptions: {
            label: 'Mode de deploiement',
            options: [],
            ngOptions: 'dm as dm.name for dm in to.options',
            required: true,
            onChange: /* @ngInject */  function (slectedDM, fieldModel, $scope) {
              if (slectedDM) {
                //set the current deployement mode
                configService.setCurrenDM(slectedDM);
                //Get or Update the entry point
                familyManager.getEntryPoint(configService.getCurrenFamily().name, slectedDM.name).then(function (entryPoint) {
                  configService.setCurrenEP(entryPoint);
                  //update products in sites
                  productManager.getConnectedProducts(configService.getCurrenFamily().name, configService.getCurrenEP().name)
                    .then(function (products) {
                      configService.setSharedProduct(products);
                      //alert that the current deployement mode has changed
                      $scope.$emit('compareCapcityNeededwithDm');
                      return products;
                    });
                  return entryPoint;
                });
                //clear products in sites when deployement mode change
                if (vm.model.sites) {
                  vm.model.sites.forEach(function (site) {
                    site.product = {};
                    site.products = [];
                  })
                }
              }
            }
          }
        },
        {
          type: 'repeatSite',
          key: 'sites',
          wrapper: "panel",
          defaultValue: [{}],
          templateOptions: {
            btnText: 'Ajouter un nouveau site',
            required: true,
            label: 'sites',
            fields: [
              {
                className: 'display-flex',
                key: 'siteProperties',
                fieldGroup: []
              },
              {
                className: 'display-flex',
                fieldGroup: [
                  {
                    className: 'flex-5',
                    key: 'product',
                    type: 'select',
                    templateOptions: {
                      label: 'Composant :',
                      options: [],
                      ngOptions: 'product as product.name for product in to.options | filter:{ occurence : "!0"  }',
                      onChange: function (product, fieldModel, scope) {
                        if (product) {
                          productManager.getConnectedRanges(configService.getCurrenFamily().name, product, scope.model.siteProperties).then(function (res) {
                            scope.fields[1].templateOptions.options = res;
                            scope.fields[2].fieldGroup = [];
                          });
                        }
                      }
                    },
                    controller: /* @ngInject */ function ($scope) {
                      $scope.model.product = {};
                      $scope.model.products = [];
                      $scope.to.options = configService.getSharedProduct();
                      //the products change if deployment mode change
                      $scope.$on('dmChanged', function () {
                        $scope.fields[0].templateOptions.options = configService.getSharedProduct();
                      });
                    }
                  },
                  {
                    className: 'flex-5',
                    key: 'range',
                    type: 'select',
                    templateOptions: {
                      label: 'Modéle :',
                      options: [],
                      ngOptions: 'range as range.name group by range.type for range in to.options',
                      onChange: function (selectedRange, viewModel, scope) {
                        scope.model.choosenCapacity = {};
                        if (selectedRange != null) {
                          if (scope.model.product.property && !angular.equals(scope.model.product, configService.getCurrenEP())) {
                            var newFields = [];
                            scope.model.product.property.forEach(function (property) {
                              newFields.push(
                                {
                                  className: 'flex-1',
                                  key: property,
                                  type: 'input',
                                  templateOptions: {
                                    label: property + ' (traité) :',
                                    type: 'number',
                                    placeholder: 'Max ' + selectedRange.maxCapacity[property],
                                    min : 0 ,
                                    max: selectedRange.maxCapacity[property]
                                  }
                                }
                              );
                            });
                            scope.fields[2].fieldGroup = newFields;
                          }
                        }
                      }
                    }
                  },
                  {
                    className: 'display-flex flex-5',
                    key: "choosenCapacity",
                    fieldGroup: [],
                    hideExpression: "!model.product || !model.range"
                  },
                  {
                    className: 'flex-1 flex-btn addProductBtn',
                    type: 'add-product',
                    hideExpression: "!model.product || !model.range ",
                    expressionProperties: {
                      'templateOptions.disabled': function(){
                        return true;
                      }
                    }
                  }
                ]
              },
              {
                key: 'products',
                type: 'ui-grid',
                templateOptions: {
                  columnDefs: [
                    {
                      name: 'Composant',
                      field: 'product',
                    },
                    {
                      name: 'Type',
                      field: 'type',
                    },
                    {
                      name: 'Modéle',
                      field: 'range',
                    },
                    {
                      name: 'EPS',
                      displayName: 'EPS',
                      field: 'choosenEPS',
                      //cellClass: cellClass,
                      //cellTemplate: '<div ng-if="isNaN(row.entity.EPS)">is not a number</div><div ng-if="!isNaN(row.entity.EPS)">is number</div>'
                    },
                    {
                      name: 'FPM',
                      displayName: 'FPM',
                      field: 'choosenFPM'
                    },
                    {
                      name : 'delete',
                      displayName: '',
                      //cellTemplate: '<a ng-click="grid.appScope.Delete(row)" class="btn btn-default btn-xs" > <span class="glyphicon glyphicon-trash"></span></a>'
                    cellTemplate : '<div class="ui-grid-cell-contents"> ' +
                    '<button type="button" class="btn btn-danger btn-xs" ng-click="deleteRow(row)"> ' +
                    '<i class="glyphicon glyphicon-trash"></i>' +
                    '</button> ' +
                    '</div>'
                    }
                    //Todo LATER
                    //{
                    //  name: 'HDR',
                    //  field: 'HDR',
                    //  displayName: 'HDR',
                    //  cellTemplate: '<input type="checkbox" ng-model="row.entity.HDR">'
                    //},
                    //{
                    //  name: 'FF',
                    //  field: 'FF',
                    //  displayName: 'FF',
                    //  cellTemplate: '<input type="checkbox" ng-model="row.entity.FF">'
                    //}
                  ],
                  onRegisterApi: ''
                }
              }
            ]
          },
          hideExpression: '!model.family || !model.deploymentMode'
        }
      ];
    }
  };

  function cellClass(grid, row, col, rowRenderIndex, colRenderIndex) {
    var value = grid.getCellValue(row, col);
    if (isNaN(value))
      return 'disable';
    else
      return 'none';
  }
}
