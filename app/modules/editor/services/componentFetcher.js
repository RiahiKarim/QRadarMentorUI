/**
 * @ngdoc service 
 * @name qradarEditor.service:componentFetcher 
 *
 * @description
 *
 */
angular
  .module('qradarEditor')
  .service('componentFetcher', componentFetcher)


function componentFetcher($q, $http, componentFactory, backEnd) {


  var availableComponents = null;
  var family = '';

  /**
   * Retrieve all components
   *
   * @returns {promise}
   */
  function getAllComponents(familyName) {
    var deferred = $q.defer(),
      component;

    if (availableComponents && family == familyName) {
     deferred.resolve(availableComponents);
    } else {
      $http.get(backEnd.url + 'family/products?familyName='+familyName).success(function (rawComponents) {
        availableComponents = {};
        angular.forEach(rawComponents, function (rawComponent) {
          component = new componentFactory["Component"](rawComponent);
          component["type"] = rawComponent.name;
          component["logo"] = "images/logos/QRadar/console.png";
          availableComponents[rawComponent.name] = component;
        });

        deferred.resolve(availableComponents);
        family = familyName;
      }).error(deferred.reject);
    }
    return deferred.promise;
  }

  return {
    getAllComponents: getAllComponents
  };
}
