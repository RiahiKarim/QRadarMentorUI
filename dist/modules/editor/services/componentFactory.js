/**
 * @ngdoc service
 * @name qradarEditor.service:componentFactory
 *
 * @description
 *
 */
angular.module('qradarEditor').service('componentFactory', componentFactory);

function componentFactory() {

  var Component = function (attributes) {

    var self = this;
    this.links = [];
    this.choosenCapacity={};
    this.range = {};
    this.supportOptions = [];

    // Set default values for properties
    angular.forEach(attributes.property, function(property) {
      self.choosenCapacity[property] = 0;
    });

      // Copy fields values
      for (var name in attributes) {
        if (attributes.hasOwnProperty(name)) {
          this[name] = attributes[name];
        }
      }
  };

  Component.prototype.createLink = function (target) {
    //if (this.links.indexOf(target.type) === -1) {
    this.links.push(target.type);
    //}
  };

  Component.prototype.removeLink = function (oldTarget) {

    var position,
      removed = false;

    if (oldTarget !== undefined && (position = this.links.indexOf(oldTarget.name)) >= 0) {
      this.links.splice(position, 1);
      removed = true;
    }

    return removed;
  };

  /**
   *
   * @param {String} map
   * @return {Array}
   */
  Component.prototype.parseMapValue = function (map) {
    var results = {},
      rawValues = map.split(','),
      key,
      value,
      mapDetails;

    angular.forEach(rawValues, function (rawValue) {
      if (rawValue === '') {
        return;
      }

      mapDetails = rawValue.split(':');

      key = mapDetails[0].trim();
      value = mapDetails[1].trim();

      if (/^\d+$/.test(value)) {
        value = parseInt(value, 10);
      }

      if (/^\d+$/.test(key)) {
        key = parseInt(key, 10);
      }

      results[key] = value;
    });

    return results;
  };

  Component.prototype.getFormattedValue = function (field, value) {
    // Check if the value is a map
    if (field.multiple === true && typeof value === 'string' && value !== '') {
      value = this.parseMapValue(value);
    }

    // Check if the value is an array
    if (field.array === true && typeof value === 'string' && value !== '') {
      value = value.split(/,\s*/);
    }

    return value;
  };

  Component.prototype.getOutputFields = function () {
    var self = this,results;
      // support : this.supportOptions,

      results = {
        productId : this.name,
        productName : this.type,
        productType : this.range.type,
        isSpecific  :  this.isSpecific,
        rangeName   : this.range.name,
        component   : this.range.component,
        initCapacity:  this.range.initCapacity  ,
        choosenCapacity : this.choosenCapacity,
        support : this.supportOptions
      };

    angular.forEach(results.support, function (support) {
        support.supportCopy=[];
    });

    angular.forEach(this.property, function(property) {
      results.choosenCapacity[property] = self.choosenCapacity[property];
    });

    return results;
  };

  Component.prototype.changeLinkedComponentName = function (name, oldName) {
    // Call remove link without calling child methods
    var removed = Component.prototype.removeLink.apply(this, [{name: oldName}]);
    if (removed) {
      Component.prototype.createLink.apply(this, [{name: name}]);
    }
  };

  return {
    Component: Component
  };
}
