'use strict';

angular
  .module('qradar')
  .service('partNumberService', partNumberService);


/* @ngInject */
function partNumberService($q,$http , backEnd) {



  function getPartNumbers(configuration) {
    var deferred = $q.defer();
    $http.post(backEnd.url+'partNumber/get',configuration).success(function (partNumbers) {
      deferred.resolve(partNumbers);
    }).error(deferred.reject);
    return deferred.promise;
  }

  return {
    getPartNumbers: getPartNumbers
  };
}

