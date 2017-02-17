'use strict';
/**
 * @ngdoc service 
 * @name qradarEditor.service:jointElement 
 *
 * @description
 *
 */
angular.module('qradarEditor')
  .factory('jointElement',jointElement);


function jointElement (jointLink) {

  return {
    createElement: function (elementData) {

      joint.shapes.html = {};

      joint.shapes.html.qradarComponent = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
          type: 'html.Element',
          attrs: {
            rect: {stroke: 'none', 'fill-opacity': 0}
          }
        }, joint.shapes.basic.Rect.prototype.defaults)
      });


      joint.shapes.html.ElementView = joint.dia.ElementView.extend({

        link: null,
        canUpdateLink: false,

        template: [
          '<div class="component">',
          '<div class="element">',
          '<span class="range"></span>',
          '</div>',
          '<div class="header">',
          '<i class="fa fa-desktop name" aria-hidden="true"></i>',
          '<button class="edit glyphicon glyphicon-wrench" data-container="body"></button>',
          '<button class="close-icon glyphicon glyphicon-remove"></button>',
          '</div>',
          '<div class="tools">',
          '<div class="create-link glyphicon glyphicon-record"></div>',
          '</div>',
          '</div>'
        ].join(''),

        initialize: function () {
          _.bindAll(this, 'updateBox');
          joint.dia.ElementView.prototype.initialize.apply(this, arguments);

          this.$box = $(_.template(this.template)());

          this.model.on('change', this.updateBox, this);
          this.model.on('remove', this.removeBox, this);
          this.updateBox();

        },
        render: function () {
          joint.dia.ElementView.prototype.render.apply(this, arguments);
          this.paper.$el.prepend(this.$box);
          this.updateBox();
          this.$box.find('.create-link').on('mousedown', this.createLink.bind(this));
          this.$box.find('.edit').on('click', this.triggerOpenDetail.bind(this));
          this.$box.find('.close-icon').on('click', _.bind(this.model.remove, this.model));
          this.$box.attr('data-type', this.model.get('componentType'));
          if (this.model.get("linkedTo").length == 0) {
            this.$box.find('.create-link').hide();
          }
          this.$box.find('.name').html(this.model.get('name'));
          this.$box.find('.range').html(this.model.get('range'));
          this.paper.$el.mousemove(this.onMouseMove.bind(this));
          this.paper.$el.mouseup(this.onMouseUp.bind(this));

          this.updateName();

          return this;
        },

        updateName: function () {
          this.$box.find('.name').html(this.model.get('name'));
          this.$box.find('.range').html(this.model.get('range'));
        },

        updateBox: function () {
          var bbox = this.model.getBBox();

          this.updateName();


          this.$box.css({
            width: bbox.width,
            height: bbox.height,
            left: bbox.x,
            top: bbox.y,
            transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
          });
        },

        removeBox: function (evt) {
          this.model.trigger('onRemove');

          this.$box.remove();
        },

        triggerOpenDetail: function (e) {
          e.preventDefault();

          this.model.trigger('onOpenDetail');
        },

        createLink: function (evt) {
          var self = this,
            paperOffset = this.paper.$el.offset(),
            targetOffset = $(evt.target).offset(),
            x = targetOffset.left - paperOffset.left,
            y = targetOffset.top;
          //y = targetOffset.top  - paperOffset.top;

          evt.stopPropagation();

          this.model.trigger('createLinkStart');

          var createdLink = new jointLink.LinkModel({
            source: {id: this.model.get('id')},
            target: g.point(x, y),
          });

          this.link = createdLink.get();

          createdLink.allowed();

          this.paper.model.addCell(this.link);

          this.linkView = this.paper.findViewByModel(this.link);

          this.link.on('change:target', function (lnk) {

            var allowedTarget = this.graph.getCell(lnk.get('source')).get("linkedTo");
            var target = lnk.get('target');
            // Check if the second arrow is uppon a rect at the first d&d (at the second jointjs will handle it correctly)

            if (typeof (target.id) === 'undefined') {
              var rect = self.paper.findViewsFromPoint(g.point(target.x, target.y))[0];
              if (!rect || lnk.get('source').id === rect.model.get('id')) {
                return;
              }
              target = rect;
              //lnk.set('target', {id: target.model.get('id')});

              var linkColor = allowedTarget.indexOf(target.model.get('componentType')) > -1 ? '#66AC3F' : '#C4434B'

              var attrs = {
                '.connection': {stroke: linkColor, opacity: 0.5},
                '.marker-target': {fill: linkColor, opacity: 0.7, stroke: linkColor}
              }
              lnk.attr(attrs);
              return;
            }
          });

          // on remove link
          this.link.on('remove', function (lnk) {
            self.model.trigger('removeLink', lnk.get('source').id, lnk.get('target').id);
          });

          this.canUpdateLink = true;
        },

        onMouseUp: function (evt) {

          if (this.linkView) {

            //// let the linkview deal with this event
            this.linkView.pointerup(evt, evt.clientX, evt.clientY);

            var allowedTarget = this.link.getSourceElement().get("linkedTo");
            var target = this.link.get('target');
            var rect = this.paper.findViewsFromPoint(g.point(target.x, target.y))[0];
            target = rect;

            if (target && allowedTarget.indexOf(target.model.get('componentType')) > -1) {
              this.link.set('target', {id: target.model.get('id')});
              this.model.trigger('createLink', this.link.getSourceElement().id, this.link.getTargetElement().id);
            } else {
              this.link.remove({skipCallbacks: true});
            }
            delete this.linkView;
          }

          this.canUpdateLink = false;
          this.paper.$el.find('.component').css('z-index', 1);

        },

        onMouseMove: function (evt) {

          if (!this.link || !this.canUpdateLink || evt.clientX <= 10) {
            return;
          }

          var droppableDocumentOffset = $(board).find('svg').offset();


          this.link.set('target', g.point(evt.clientX - droppableDocumentOffset.left, evt.clientY - droppableDocumentOffset.top));
        }
      });

      var node = new joint.shapes.html.qradarComponent(elementData);

      return node;
    }
  };
}
