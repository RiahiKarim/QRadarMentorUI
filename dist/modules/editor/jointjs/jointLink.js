'use strict';
/**
 * @ngdoc service 
 * @name qradarEditor.service:jointLink 
 *
 * @description
 *
 */
    angular
        .module('qradarEditor')
        .factory('jointLink', jointLink);


    /* @ngInject */
    function jointLink() {


      var LinkModel = function(params){
        var self = this;
        self.params = params;
      };

      LinkModel.prototype.get = function () {
        return new joint.dia.Link({
          source: this.params.source,
          target: this.params.target,
          arrowheadMovs : false,
          z: -1,
          attrs: {
            '.connection': { stroke: '#66AC3F', 'stroke-width': 6, opacity: 0.5 } ,
            '.marker-target': { stroke: '#66AC3F', opacity:0.5, fill: '#66AC3F', 'stroke-width': 2, d: 'M 10 0 L 0 5 L 10 10 z' },
            '.marker-source': { display: 'none' },
            '.marker-arrowhead[end=target]':{d:"M 10 0 L 0 5 L 10 10 z"}
          }
        })
      };

      LinkModel.prototype.allowed = function() {

      };

      LinkModel.prototype.invalidTarget = function() {
    }

      return  {
        LinkModel: LinkModel
      };
    }
