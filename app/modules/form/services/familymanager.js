'use strict';

/**
 * @ngdoc service
 * @name qradarForm.familyManager
 * @description
 * # familyManager
 * Service in the qradarForm.
 */
angular.module('qradarForm')
  .factory('familyManager', familyManager );

  /* @ngInject */
  function familyManager ($http, $q,Family,backEnd) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return  {
      _pool: {},

      _retrieveInstance: function(familyName, familyData) {
        var instance = this._pool[familyName];

        if (instance) {
          instance.setData(familyData);
        } else {
          instance = new Family(familyData);
          this._pool[familyName] = instance;
        }

        return instance;
      },

      _search: function(familyName) {
        return this._pool[familyName];
      },

      _load: function(familyName, deferred) {
        var scope = this;

        $http.get(backEnd.url+'/api/family/' + familyName)
          .success(function(familyData, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            var book = scope._retrieveInstance(familyData.id, familyData);
            deferred.resolve(book);
          })
          .error(function(familyData, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            deferred.reject();
          });
      },

      /* Public Methods */
      /* Use this function in order to get a Family instance by it's id */
      getFamily : function(familyName) {
        var deferred = $q.defer();
        var family = this._search(familyName);
        if (family) {
          deferred.resolve(family);
        } else {
          this._load(familyName, deferred);
        }
        return deferred.promise;
      },
      /* Use this function in order to get instances of all the families */
      loadAllFamilies: function() {
        var deferred = $q.defer();
        var scope = this;
        $http.get(backEnd.url+'family/all')
          .success(function(familiesArray) {
            var families = [];
            familiesArray.forEach(function(familyData) {
               var family = scope._retrieveInstance(familyData.name, familyData);
              families.push(family);
            });

            deferred.resolve(families);
          })
          .error(function() {
            deferred.reject();
          });
        return deferred.promise;
      },
      /*  This function is useful when we got somehow the family data and we wish to store it or update the pool and get a family instance in return */
      setFamily: function(familyData) {
        var scope = this;
        var family = this._search(familyData.id);
        if (family) {
          family.setData(familyData);
        } else {
          family = scope._retrieveInstance(familyData);
        }
        return family;
      },
      getDeployementModes : function(familyName){
        var deferred = $q.defer();
        //TODO use ressource instead  of http
        $http.get(backEnd.url+'family/deployementModes?familyName=' + familyName)
          .success(function(deployementModes, status, headers, config) {
            deferred.resolve(deployementModes);
          })
          .error(function(familyData, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            deferred.reject();
          });
        return deferred.promise;
      },
      /* Use this function in order to get the entry point for a specific family and deployement mode */
      getEntryPoint : function(familyName, deploymentMode){
        var deferred = $q.defer();
        //TODO use ressource instead  of http
        $http.get(backEnd.url+'family/entryPoint', {
            params: {
              familyName: familyName,
              deploymentMode: deploymentMode
            }
          })
          .success(function(entryPoint, status, headers, config) {
            deferred.resolve(entryPoint);
          })
          .error(function(error, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            deferred.reject();
          });
        return deferred.promise;
      }

    };
  }
