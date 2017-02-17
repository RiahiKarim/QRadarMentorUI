/**
 * @ngdoc controller
 * @name qradarEditor.controller:boardCtrl
 *
 * @description
 * This is the board controller, it contain  the business logic needed for the graphical view.
 *
 * <pre>
 *     <div ng-controller="boardCtrl"></div>
 * </pre>
 */
angular
  .module('qradarEditor')
  .controller('boardCtrl', boardCtrl);

/* @ngInject */
function boardCtrl($scope, $uibModal, $window, selectedComponents, componentFetcher, jointElement,toastr) {

  $scope.graph = new joint.dia.Graph;

  $scope.components = selectedComponents.components;

  var allComponents = {};

  var familyName = $scope.$parent.vm.selectedFamily.name;

  getAllComponents(familyName);

  $scope.$on('familyChanged', function (event, args) {
    familyName = args.family.name;
    $scope.graph.clear();
    getAllComponents(familyName);
  });

  function getAllComponents(familyName) {
    componentFetcher.getAllComponents(familyName).then(function (components) {
      allComponents = components;
    });
  }

  /**
   * @ngdoc method
   * @name createLink
   * @methodOf qradarEditor.controller:boardCtrl
   * @description
   * Add target component into source component links.
   *
   * @param {string} sourceId Id of the source component.
   * @param {string} targetId Id of the target component.
   */
  function createLink(sourceId, targetId) {

    var sourceName = $scope.graph.getCell(sourceId).get('name'),
      targetName = $scope.graph.getCell(targetId).get('name'),
      source = $scope.components[sourceName],
      target = $scope.components[targetName];
    source.createLink(target);
    //$scope.$apply();
  }

  /**
   * @ngdoc method
   * @name removeLink
   * @methodOf qradarEditor.controller:boardCtrl
   * @description
   * Remove target component from source component links.
   *
   * @param {string} sourceId Id of the source component.
   * @param {string} targetId Id of the target component.
   */
  function removeLink(sourceId, targetId) {
    if (sourceId && targetId) {
      var sourceName = $scope.graph.getCell(sourceId).get('name'),
        targetName = $scope.graph.getCell(targetId).get('name'),
        source = $scope.components[sourceName],
        target = $scope.components[targetName];
      if (source)
        source.removeLink(target);
    }
    //$scope.$apply();
  }

  /**
   * @ngdoc method
   * @name onRemove
   * @methodOf qradarEditor.controller:boardCtrl
   * @description
   * Method invoked when node or link is removed from the board. it removes the element from the $scope.
   *
   */
  function onRemove() {
    var name = this.get('name'),
      position;

    // Remove links
    angular.forEach($scope.components, function (component) {
      if ((position = $.inArray(name, component.links)) >= 0) {
        component.links.splice(position, 1);
      }
    });

    delete $scope.components[name];
    //$scope.$apply();
  }

  /**
   * @ngdoc method
   * @name onOpenDetail
   * @methodOf qradarEditor.controller:boardCtrl
   * @description
   * Method invoked when the user want to edit the component details.
   *
   */
  function onOpenDetail() {

    var componentName = this.get('name'),
        rangeName = this.get("range"),
        editModal;

    editModal = $uibModal.open({
      backdrop  : 'static',
      keyboard  : false,
      templateUrl: 'modules/editor/views/edit-component.html',
      controller: 'editComponentCtrl',
      resolve: {
        values: function () {
          var values = $scope.components[componentName];
          values.familyName = familyName;
          values.name = componentName;
          return values;
        }
      }
    });

    editModal.result.then(function (formData) {
      // Detect rang  changes
      if(formData.values.range.name != rangeName){
        // Update the range of the jointjs graph element
        var rects = $scope.graph.getElements();
        angular.forEach(rects, function (rect) {
          if (rect.get('name') === componentName) {
            rect.set('range', formData.values.range.name);
          }
        });
      }

      // Detect component name changes
      if (formData.name !== componentName) {
        delete $scope.components[componentName];

        // Update links name of other components
        angular.forEach($scope.components, function (otherComponent) {
          otherComponent.changeLinkedComponentName(formData.name, componentName);
        });

        // Update the name of the jointjs graph element
        var rects = $scope.graph.getElements();
        angular.forEach(rects, function (rect) {
          if (rect.get('name') === componentName) {
            rect.set('name', formData.name);
          }
        });
      }

      $scope.components[formData.name] = formData.values;
    });
  }

  /**
   * @ngdoc method
   * @name handleDrop
   * @methodOf qradarEditor.controller:boardCtrl
   * @description
   * Handle dropped item into the graphic area.
   *
   * @param {object} component The dropped component.
   * @param {object} board The graphic area.
   * @param {object} event The drop event, useful to catch the mouse position.
   */
  $scope.handleDrop = function (component, board, event) {

    var droppableDocumentOffset = $(board).find("svg").offset(),
      X = (event.x || event.clientX) - droppableDocumentOffset.left - (component.clientWidth / 2) + $window.pageXOffset,
      Y = (event.y || event.clientY) - droppableDocumentOffset.top - (component.clientHeight / 2) + $window.pageYOffset,
      type = component.attributes['data-type'].value,
      name = selectedComponents.getElementName(type),
      componentInstance = allComponents[type],
      range = componentInstance.ranges[0].name,
      linkedTo = component.attributes['linkedTo'].value,
      occurence = component.attributes['data-occurence'].value,
      node;


    //check the occurence of the added element
    var count = 0;
    angular.forEach($scope.components, function (component) {
      if (component.type === type)
        count++;
    });
    if (!isNaN(occurence) && count >= occurence) {
      toastr.info('Vous ne pouvez plus ajouter de '+ type, 'Information :');
    } else {
      node = new jointElement.createElement({
        position: {x: X, y: Y},
        size: {width: 216, height: 96},
        name: name,
        componentType: component.attributes['data-type'].value,
        linkedTo: JSON.parse(linkedTo),
        logo: component.attributes['data-logo'].value,
        range : range ,
        options: {interactive: true}
      });


      $scope.graph.addCell(node);
      node.on('createLink', createLink);
      node.on('removeLink', removeLink);
      node.on('onOpenDetail', onOpenDetail);
      node.on('onRemove', onRemove);

      $scope.components[name] = angular.copy(componentInstance);
      $scope.components[name].name = name;
      $scope.components[name].range = $scope.components[name].ranges[0];
      //$scope.$apply();
    }
  };
}
