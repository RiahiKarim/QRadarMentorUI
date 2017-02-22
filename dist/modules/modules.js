"use strict";function partNumberService(a,b,c){function d(d){var e=a.defer();return b.post(c.url+"partNumber/get",d).success(function(a){e.resolve(a)}).error(e.reject),e.promise}return{getPartNumbers:d}}function graphic(a,b,c,d,e,f,g){function h(){b.get(a.url+"family/all").success(function(a){i.families=a,i.selectedFamily=i.families[0]}),b.get(a.url+"maintenanceOption/all").success(function(a){i.maintenanceOptions=a})}var i=this;h(),i.components=d.components,i.activate=h,i.families={},i.maintenanceOptions={},i.systemZ=!1,i.maintenance=i.famiyChanged=function(a,b){angular.equals({},i.components)?c.$broadcast("familyChanged",{family:a}):confirm("Tous les éléments présents dans le graphe seront supprimés.")?c.$broadcast("familyChanged",{family:a}):i.selectedFamily=angular.fromJson(b)},i.pageSlideOpen=!1,i.validateConfig=function(){var a={familyName:i.selectedFamily.name,components:i.components,systemZ:i.systemZ,maintenance:[]};if(f.checkLinks(a.components)){var b=g.open({backdrop:"static",keyboard:!1,templateUrl:"modules/editor/views/maintenance-modal.html",controller:"maintenanceModalCtrl",resolve:{maintenanceOptions:function(){return i.maintenanceOptions}}});b.result.then(function(b){i.pageSlideOpen=!0,a.maintenance[0]=b.name,e.getPartNumbers(f.getConfig(a)).then(function(a){d.setPartNumbers(a)})})}}}function componentsCtrl(a,b){function c(c){a.components=[],b.getAllComponents(c).then(function(b){for(var c in b)b.hasOwnProperty(c)&&a.components.push(b[c])})}c(a.$parent.vm.selectedFamily.name),a.$on("familyChanged",function(a,b){c(b.family.name)})}function boardCtrl(a,b,c,d,e,f,g){function h(a){e.getAllComponents(a).then(function(a){m=a})}function i(b,c){var d=a.graph.getCell(b).get("name"),e=a.graph.getCell(c).get("name"),f=a.components[d],g=a.components[e];f.createLink(g)}function j(b,c){if(b&&c){var d=a.graph.getCell(b).get("name"),e=a.graph.getCell(c).get("name"),f=a.components[d],g=a.components[e];f&&f.removeLink(g)}}function k(){var b,c=this.get("name");angular.forEach(a.components,function(a){(b=$.inArray(c,a.links))>=0&&a.links.splice(b,1)}),delete a.components[c]}function l(){var c,d=this.get("name"),e=this.get("range");c=b.open({backdrop:"static",keyboard:!1,templateUrl:"modules/editor/views/edit-component.html",controller:"editComponentCtrl",resolve:{values:function(){var b=a.components[d];return b.familyName=n,b.name=d,b}}}),c.result.then(function(b){if(b.values.range.name!=e){var c=a.graph.getElements();angular.forEach(c,function(a){a.get("name")===d&&a.set("range",b.values.range.name)})}if(b.name!==d){delete a.components[d],angular.forEach(a.components,function(a){a.changeLinkedComponentName(b.name,d)});var c=a.graph.getElements();angular.forEach(c,function(a){a.get("name")===d&&a.set("name",b.name)})}a.components[b.name]=b.values})}a.graph=new joint.dia.Graph,a.components=d.components;var m={},n=a.$parent.vm.selectedFamily.name;h(n),a.$on("familyChanged",function(b,c){n=c.family.name,a.graph.clear(),h(n)}),a.handleDrop=function(b,e,h){var n,o=$(e).find("svg").offset(),p=(h.x||h.clientX)-o.left-b.clientWidth/2+c.pageXOffset,q=(h.y||h.clientY)-o.top-b.clientHeight/2+c.pageYOffset,r=b.attributes["data-type"].value,s=d.getElementName(r),t=m[r],u=t.ranges[0].name,v=b.attributes.linkedTo.value,w=b.attributes["data-occurence"].value,x=0;angular.forEach(a.components,function(a){a.type===r&&x++}),!isNaN(w)&&x>=w?g.info("Vous ne pouvez plus ajouter de "+r,"Information :"):(n=new f.createElement({position:{x:p,y:q},size:{width:216,height:96},name:s,componentType:b.attributes["data-type"].value,linkedTo:JSON.parse(v),logo:b.attributes["data-logo"].value,range:u,options:{interactive:!0}}),a.graph.addCell(n),n.on("createLink",i),n.on("removeLink",j),n.on("onOpenDetail",l),n.on("onRemove",k),a.components[s]=angular.copy(t),a.components[s].name=s,a.components[s].range=a.components[s].ranges[0])}}function editComponentCtrl(a,b,c,d,e,f,g){function h(){a.values.range&&f.get(g.url+"supportOption/get?type="+a.values.range.type+"&family=SIEM").success(function(b){a.fields.supportOptions=b})}var i={};d.getAllComponents(e.familyName).then(function(b){i=b,a.fields={properties:i[e.type].property||[],ranges:i[e.type].ranges||[]},a.componentNames=Object.keys(c.components),a.values=e,h()}),a.getSupportOptionsWhenProductChanges=function(){a.values.supportOptions=[],h()},a.hasPrequisite=function(a){return null!=a?e.supportOptions.length>0?"undefined"==typeof _.find(e.supportOptions,{key:a[0]}):!0:!1},a.uncheck=function(b,c){angular.forEach(_.filter(a.values.supportOptions,function(a){return _.has(a,"prerequisite")}),function(d){_.includes(d.prerequisite,b.key)&&0==c&&(a.values.supportOptions=_.without(e.supportOptions,d,b))})},a.ok=function(c){c.$valid&&b.close({name:a.values.name,values:a.values})},a.cancel=function(){b.dismiss("cancel")}}function maintenanceModalCtrl(a,b,c){a.maintenanceOptions=c,a.selected={option:a.maintenanceOptions[0]},a.ok=function(c){c.$valid&&b.close(a.selected.option)},a.cancel=function(){b.dismiss("cancel")}}function componentFetcher(a,b,c,d){function e(e){var h,i=a.defer();return f&&g==e?i.resolve(f):b.get(d.url+"family/products?familyName="+e).success(function(a){f={},angular.forEach(a,function(a){h=new c.Component(a),h.type=a.name,h.logo="images/logos/QRadar/console.png",f[a.name]=h}),i.resolve(f),g=e}).error(i.reject),i.promise}var f=null,g="";return{getAllComponents:e}}function componentFactory(){var a=function(a){var b=this;this.links=[],this.choosenCapacity={},this.range={},this.supportOptions=[],angular.forEach(a.property,function(a){b.choosenCapacity[a]=0});for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c])};return a.prototype.createLink=function(a){this.links.push(a.type)},a.prototype.removeLink=function(a){var b,c=!1;return void 0!==a&&(b=this.links.indexOf(a.name))>=0&&(this.links.splice(b,1),c=!0),c},a.prototype.parseMapValue=function(a){var b,c,d,e={},f=a.split(",");return angular.forEach(f,function(a){""!==a&&(d=a.split(":"),b=d[0].trim(),c=d[1].trim(),/^\d+$/.test(c)&&(c=parseInt(c,10)),/^\d+$/.test(b)&&(b=parseInt(b,10)),e[b]=c)}),e},a.prototype.getFormattedValue=function(a,b){return a.multiple===!0&&"string"==typeof b&&""!==b&&(b=this.parseMapValue(b)),a.array===!0&&"string"==typeof b&&""!==b&&(b=b.split(/,\s*/)),b},a.prototype.getOutputFields=function(){var a,b=this;return a={productId:this.name,productName:this.type,productType:this.range.type,isSpecific:this.isSpecific,rangeName:this.range.name,component:this.range.component,initCapacity:this.range.initCapacity,choosenCapacity:this.choosenCapacity,support:this.supportOptions},angular.forEach(a.support,function(a){a.supportCopy=[]}),angular.forEach(this.property,function(c){a.choosenCapacity[c]=b.choosenCapacity[c]}),a},a.prototype.changeLinkedComponentName=function(b,c){var d=a.prototype.removeLink.apply(this,[{name:c}]);d&&a.prototype.createLink.apply(this,[{name:b}])},{Component:a}}function jointLink(){var a=function(a){var b=this;b.params=a};return a.prototype.get=function(){return new joint.dia.Link({source:this.params.source,target:this.params.target,arrowheadMovs:!1,z:-1,attrs:{".connection":{stroke:"#66AC3F","stroke-width":6,opacity:.5},".marker-target":{stroke:"#66AC3F",opacity:.5,fill:"#66AC3F","stroke-width":2,d:"M 10 0 L 0 5 L 10 10 z"},".marker-source":{display:"none"},".marker-arrowhead[end=target]":{d:"M 10 0 L 0 5 L 10 10 z"}}})},a.prototype.allowed=function(){},a.prototype.invalidTarget=function(){},{LinkModel:a}}function jsonParser(a){function b(b){var d=!0;return angular.forEach(b,function(b){0!=b.linkedTo.length&&0==b.links.length&&(a.warning(b.name+" doit être lié avec :"+c(_.uniq(b.linkedTo)),"Warning"),d=!1)}),d}function c(a){var b=" ";return a.forEach(function(a,c,d){b+=c===d.length-1?a+".":a+", "}),angular.forEach(a,function(a){}),b}function d(a){var b={Config:{familyName:a.familyName,maintenance:a.maintenance,systemZ:a.systemZ,chosenProducts:[]}};return angular.forEach(a.components,function(a){var c=a.getOutputFields();b.Config.chosenProducts.push(c)}),b}return{getConfig:d,checkLinks:b}}function jointElement(a){return{createElement:function(b){joint.shapes.html={},joint.shapes.html.qradarComponent=joint.shapes.basic.Rect.extend({defaults:joint.util.deepSupplement({type:"html.Element",attrs:{rect:{stroke:"none","fill-opacity":0}}},joint.shapes.basic.Rect.prototype.defaults)}),joint.shapes.html.ElementView=joint.dia.ElementView.extend({link:null,canUpdateLink:!1,template:['<div class="component">','<div class="element">','<span class="range"></span>',"</div>",'<div class="header">','<i class="fa fa-desktop name" aria-hidden="true"></i>','<button class="edit glyphicon glyphicon-wrench" data-container="body"></button>','<button class="close-icon glyphicon glyphicon-remove"></button>',"</div>",'<div class="tools">','<div class="create-link glyphicon glyphicon-record"></div>',"</div>","</div>"].join(""),initialize:function(){_.bindAll(this,"updateBox"),joint.dia.ElementView.prototype.initialize.apply(this,arguments),this.$box=$(_.template(this.template)()),this.model.on("change",this.updateBox,this),this.model.on("remove",this.removeBox,this),this.updateBox()},render:function(){return joint.dia.ElementView.prototype.render.apply(this,arguments),this.paper.$el.prepend(this.$box),this.updateBox(),this.$box.find(".create-link").on("mousedown",this.createLink.bind(this)),this.$box.find(".edit").on("click",this.triggerOpenDetail.bind(this)),this.$box.find(".close-icon").on("click",_.bind(this.model.remove,this.model)),this.$box.attr("data-type",this.model.get("componentType")),0==this.model.get("linkedTo").length&&this.$box.find(".create-link").hide(),this.$box.find(".name").html(this.model.get("name")),this.$box.find(".range").html(this.model.get("range")),this.paper.$el.mousemove(this.onMouseMove.bind(this)),this.paper.$el.mouseup(this.onMouseUp.bind(this)),this.updateName(),this},updateName:function(){this.$box.find(".name").html(this.model.get("name")),this.$box.find(".range").html(this.model.get("range"))},updateBox:function(){var a=this.model.getBBox();this.updateName(),this.$box.css({width:a.width,height:a.height,left:a.x,top:a.y,transform:"rotate("+(this.model.get("angle")||0)+"deg)"})},removeBox:function(a){this.model.trigger("onRemove"),this.$box.remove()},triggerOpenDetail:function(a){a.preventDefault(),this.model.trigger("onOpenDetail")},createLink:function(b){var c=this,d=this.paper.$el.offset(),e=$(b.target).offset(),f=e.left-d.left,h=e.top;b.stopPropagation(),this.model.trigger("createLinkStart");var i=new a.LinkModel({source:{id:this.model.get("id")},target:g.point(f,h)});this.link=i.get(),i.allowed(),this.paper.model.addCell(this.link),this.linkView=this.paper.findViewByModel(this.link),this.link.on("change:target",function(a){var b=this.graph.getCell(a.get("source")).get("linkedTo"),d=a.get("target");if("undefined"==typeof d.id){var e=c.paper.findViewsFromPoint(g.point(d.x,d.y))[0];if(!e||a.get("source").id===e.model.get("id"))return;d=e;var f=b.indexOf(d.model.get("componentType"))>-1?"#66AC3F":"#C4434B",h={".connection":{stroke:f,opacity:.5},".marker-target":{fill:f,opacity:.7,stroke:f}};return void a.attr(h)}}),this.link.on("remove",function(a){c.model.trigger("removeLink",a.get("source").id,a.get("target").id)}),this.canUpdateLink=!0},onMouseUp:function(a){if(this.linkView){this.linkView.pointerup(a,a.clientX,a.clientY);var b=this.link.getSourceElement().get("linkedTo"),c=this.link.get("target"),d=this.paper.findViewsFromPoint(g.point(c.x,c.y))[0];c=d,c&&b.indexOf(c.model.get("componentType"))>-1?(this.link.set("target",{id:c.model.get("id")}),this.model.trigger("createLink",this.link.getSourceElement().id,this.link.getTargetElement().id)):this.link.remove({skipCallbacks:!0}),delete this.linkView}this.canUpdateLink=!1,this.paper.$el.find(".component").css("z-index",1)},onMouseMove:function(a){if(this.link&&this.canUpdateLink&&!(a.clientX<=10)){var b=$(board).find("svg").offset();this.link.set("target",g.point(a.clientX-b.left,a.clientY-b.top))}}});var c=new joint.shapes.html.qradarComponent(b);return c}}}function MainCtrl(a,b,c,d){function e(){}var f=this;f.model={},f.fields=b.createForm(f),f.onSubmit=e,a.$on("compareCapcityNeededwithDm",function(){a.$broadcast("dmChanged"),f.model.sites&&!angular.equals({},c.getCurrenDM())&&(c.setCapacityNeeded(f.model.sites),angular.equals({},c.getCurrenDM().maxCapacity)?f.error="":c.dmCanSupportNeeds()?f.error="":d.info("Le mode de deploiement ne supporte pas la capcité requise"))})}function Family(a){function b(a){a&&this.setData(a)}return b.prototype={setData:function(a){angular.extend(this,a)}},b}function Product(a){function b(a){a&&this.setData(a)}return b.prototype={setData:function(a){angular.extend(this,a)}},b}function productType(){function a(a){a&&this.setData(a)}return a.prototype={setData:function(a){angular.extend(this,a)}},a}function familyManager(a,b,c,d){return{_pool:{},_retrieveInstance:function(a,b){var d=this._pool[a];return d?d.setData(b):(d=new c(b),this._pool[a]=d),d},_search:function(a){return this._pool[a]},_load:function(b,c){var e=this;a.get(d.url+"/api/family/"+b).success(function(a,b,d,f){var g=e._retrieveInstance(a.id,a);c.resolve(g)}).error(function(a,b,d,e){c.reject()})},getFamily:function(a){var c=b.defer(),d=this._search(a);return d?c.resolve(d):this._load(a,c),c.promise},loadAllFamilies:function(){var c=b.defer(),e=this;return a.get(d.url+"family/all").success(function(a){var b=[];a.forEach(function(a){var c=e._retrieveInstance(a.name,a);b.push(c)}),c.resolve(b)}).error(function(){c.reject()}),c.promise},setFamily:function(a){var b=this,c=this._search(a.id);return c?c.setData(a):c=b._retrieveInstance(a),c},getDeployementModes:function(c){var e=b.defer();return a.get(d.url+"family/deployementModes?familyName="+c).success(function(a,b,c,d){e.resolve(a)}).error(function(a,b,c,d){e.reject()}),e.promise},getEntryPoint:function(c,e){var f=b.defer();return a.get(d.url+"family/entryPoint",{params:{familyName:c,deploymentMode:e}}).success(function(a,b,c,d){f.resolve(a)}).error(function(a,b,c,d){f.reject()}),f.promise}}}function productManager(a,b,c){return{getConnectedProducts:function(d,e){var f=b.defer();return e?(a.get(c.url+"product/connectedProducts",{params:{familyName:d,productName:e}}).success(function(a,b,c,d){f.resolve(a)}).error(function(a,b,c,d){f.reject()}),f.promise):void 0},getConnectedRanges:function(d,e,f){var g={};e.property&&e.property.forEach(function(a){g[a]=f[a]});var h=b.defer();return a.post(c.url+"product/connectedRanges?familyName="+d+"&productName="+e.name).success(function(a,b,c,d){h.resolve(a)}).error(function(a,b,c,d){h.reject()}),h.promise}}}function typeManager(a,b,c){return{_pool:{},_retrieveInstance:function(a,b){var d=this._pool[a];return d?d.setData(b):(d=new c(b),this._pool[a]=d),d},loadAllTypes:function(){var c=b.defer(),d=this;return a.get("http://192.168.99.100:9002/api/productType/types").success(function(a){var b=[];a.forEach(function(a){var c=d._retrieveInstance(a.name,a);b.push(c)}),c.resolve(b)}).error(function(){c.reject()}),c.promise}}}function formlyBuilder(a,b,c){return{createForm:function(d){return[{key:"family",type:"select",templateOptions:{label:"Famille",options:[],ngOptions:"family as family.name for family in to.options",required:!0,onChange:function(b){delete d.model.sites,delete d.model.deploymentMode,b&&(c.setCurrenFamily(b),a.getDeployementModes(b.name).then(function(a){d.fields[1].templateOptions.options=a}))}},controller:function(b){b.to.loading=a.loadAllFamilies().then(function(a){return b.to.options=a,a})}},{key:"deploymentMode",type:"select",templateOptions:{label:"Mode de deploiement",options:[],ngOptions:"dm as dm.name for dm in to.options",required:!0,onChange:function(e,f,g){e&&(c.setCurrenDM(e),a.getEntryPoint(c.getCurrenFamily().name,e.name).then(function(a){return c.setCurrenEP(a),b.getConnectedProducts(c.getCurrenFamily().name,c.getCurrenEP().name).then(function(a){return c.setSharedProduct(a),g.$emit("compareCapcityNeededwithDm"),a}),a}),d.model.sites&&d.model.sites.forEach(function(a){a.product={},a.products=[]}))}}},{type:"repeatSite",key:"sites",wrapper:"panel",defaultValue:[{}],templateOptions:{btnText:"Ajouter un nouveau site",required:!0,label:"sites",fields:[{className:"display-flex",key:"siteProperties",fieldGroup:[]},{className:"display-flex",fieldGroup:[{className:"flex-5",key:"product",type:"select",templateOptions:{label:"Composant :",options:[],ngOptions:'product as product.name for product in to.options | filter:{ occurence : "!0"  }',onChange:function(a,d,e){a&&b.getConnectedRanges(c.getCurrenFamily().name,a,e.model.siteProperties).then(function(a){e.fields[1].templateOptions.options=a,e.fields[2].fieldGroup=[]})}},controller:function(a){a.model.product={},a.model.products=[],a.to.options=c.getSharedProduct(),a.$on("dmChanged",function(){a.fields[0].templateOptions.options=c.getSharedProduct()})}},{className:"flex-5",key:"range",type:"select",templateOptions:{label:"Modéle :",options:[],ngOptions:"range as range.name group by range.type for range in to.options",onChange:function(a,b,d){if(d.model.choosenCapacity={},null!=a&&d.model.product.property&&!angular.equals(d.model.product,c.getCurrenEP())){var e=[];d.model.product.property.forEach(function(b){e.push({className:"flex-1",key:b,type:"input",templateOptions:{label:b+" (traité) :",type:"number",placeholder:"Max "+a.maxCapacity[b],min:0,max:a.maxCapacity[b]}})}),d.fields[2].fieldGroup=e}}}},{className:"display-flex flex-5",key:"choosenCapacity",fieldGroup:[],hideExpression:"!model.product || !model.range"},{className:"flex-1 flex-btn addProductBtn",type:"add-product",hideExpression:"!model.product || !model.range ",expressionProperties:{"templateOptions.disabled":function(){return!0}}}]},{key:"products",type:"ui-grid",templateOptions:{columnDefs:[{name:"Composant",field:"product"},{name:"Type",field:"type"},{name:"Modéle",field:"range"},{name:"EPS",displayName:"EPS",field:"choosenEPS"},{name:"FPM",displayName:"FPM",field:"choosenFPM"},{name:"delete",displayName:"",cellTemplate:'<div class="ui-grid-cell-contents"> <button type="button" class="btn btn-danger btn-xs" ng-click="deleteRow(row)"> <i class="glyphicon glyphicon-trash"></i></button> </div>'}],onRegisterApi:""}}]},hideExpression:"!model.family || !model.deploymentMode"}]}}}function RepeatSiteCtrl(a,b){function c(a){return a=angular.copy(a),a[1].fieldGroup[0].templateOptions.options=[],f(a),a}function d(){a.model[a.options.key]=a.model[a.options.key]||[];var b=a.model[a.options.key],c={};c.id=j++,b.push(c)}function e(b){a.model[a.options.key].splice(b,1),a.$emit("compareCapcityNeededwithDm")}function f(a){i++,angular.forEach(a,function(a,b){return a.fieldGroup?void f(a.fieldGroup):(a.templateOptions&&a.templateOptions.fields&&f(a.templateOptions.fields),void(a.id=a.id||a.key+"_"+b+"_"+i+g(0,9999)))})}function g(a,b){return Math.floor(Math.random()*(b-a))+a}function h(){var c=[];b.getCurrenFamily().properties.forEach(function(a){c.push({className:"flex-1",type:"input",key:a,defaultValue:0,templateOptions:{label:a,type:"number",required:!0,onChange:function(a,b,c){c.$emit("compareCapcityNeededwithDm")}}})}),a.to.fields[0].fieldGroup=c}var i=1,j=0;a.formOptions={formState:a.formState},a.addSite=d,a.copyFields=c,a.removeSite=e,h()}function configService(){function a(a){l=a}function b(){return l}function c(a){m=a}function d(){return m}function e(a){n=a}function f(){return n}function g(a){var b={};l.properties.forEach(function(c){var d=0;a.forEach(function(a){d+=parseFloat(a.siteProperties[c])||0}),b[c]=d}),o=b}function h(){return o}function i(){var a=!0;return Object.keys(o).forEach(function(b){a=a&&o[b]<=m.maxCapacity[b]}),a}function j(a){p=a.concat(n)}function k(){return p}var l={},m={},n={},o={},p=[];return{setCurrenFamily:a,getCurrenFamily:b,setCurrenDM:c,getCurrenDM:d,setCurrenEP:e,getCurrenEP:f,setCapacityNeeded:g,getCapacityNeeded:h,dmCanSupportNeeds:i,setSharedProduct:j,getSharedProduct:k}}function RepeatProductCtrl(a){function b(a){return a=angular.copy(a),e(a),a}function c(){a.model[a.options.key]=a.model[a.options.key]||[];var b=a.model[a.options.key],c={};b.push(c)}function d(b){a.model[a.options.key].splice(b,1)}function e(a){g++,angular.forEach(a,function(a,b){return a.fieldGroup?void e(a.fieldGroup):(a.templateOptions&&a.templateOptions.fields&&e(a.templateOptions.fields),void(a.id=a.id||a.key+"_"+b+"_"+g+f(0,9999)))})}function f(a,b){return Math.floor(Math.random()*(b-a))+a}var g=1;a.formOptions={formState:a.formState},a.addProduct=c,a.copyFields=b,a.removeProduct=d}function ProductsGridCtrl(a){a.gridOptions={data:a.model[a.options.key],columnDefs:a.to.columnDefs,onRegisterApi:a.to.onRegisterApi,enableSoting:!1,enableColumnMenus:!1,enableColumnResizing:!0,showSelectionCheckbox:!0,minRowsToShow:3},console.log(a),a.deleteRow=function(b){var c=a.gridOptions.data.indexOf(b.entity);a.gridOptions.data.splice(c,1)}}function AddProductCtrl(a,b,c){function d(a,b){var c=!0;return Object.keys(a).forEach(function(d){c=c&&b[d]<=a[d]}),c}a.disable=function(){return a.model.range&&!angular.equals(a.model.product,b.getCurrenEP())?angular.equals(a.model.range.maxCapacity,{})?!1:!d(a.model.range.maxCapacity,a.model.choosenCapacity):void 0},a.add=function(){0!=a.model.product.occurence&&(a.model.products.push({product:a.model.product.name,type:a.model.range.type,range:a.model.range.name,choosenEPS:a.model.choosenCapacity.EPS,choosenFPM:a.model.choosenCapacity.FPM}),"n"!=a.model.product.occurence&&(a.model.product.occurence=a.model.product.occurence-1),c.getConnectedProducts(b.getCurrenFamily().name,a.model.product.name).then(function(b){var c=[];b.forEach(function(b){var d=!1;a.fields[0].templateOptions.options.forEach(function(a){a.name==b.name&&(d=!0)}),d||c.push(b)}),a.fields[0].templateOptions.options=a.fields[0].templateOptions.options.concat(c)}),delete a.model.product,delete a.model.range,delete a.model.choosenCapacity,a.fields[1].templateOptions.options=[])}}angular.module("qradar",["qradarHome","qradarForm","qradarEditor","angular-loading-bar","ngAnimate","toastr","pageslide-directive"]).config(function(a){angular.extend(a,{autoDismiss:!1,maxOpened:5,newestOnTop:!0,positionClass:"toast-top-right",preventOpenDuplicates:!0,timeOut:1e4,extendedTimeOut:1e9,tapToDismiss:!1,closeButton:!0})}).filter("trim",function(){return function(a){return angular.isString(a)?a.replace(/^\s+|\s+$/g,""):a}}).constant("backEnd",{url:"http://169.44.118.214/api/"}),angular.module("qradar").service("partNumberService",partNumberService),angular.module("qradarHome",["ngRoute"]).config(function(a){a.when("/",{templateUrl:"modules/home/home.html"})}),angular.module("qradarEditor",["ngRoute","ui.bootstrap","checklist-model","ngScrollbars"]).config(function(a){a.defaults={scrollButtons:{enable:!0},scrollbarPosition:"inside",scrollInertia:400,axis:"yx",theme:"3d-dark",autoHideScrollbar:!0}}).config(function(a){a.when("/graphic",{templateUrl:"modules/editor/views/graphic.html",controller:"graphic",controllerAs:"vm"})}),angular.module("qradarEditor").controller("graphic",graphic),angular.module("qradarEditor").controller("componentsCtrl",componentsCtrl),angular.module("qradarEditor").controller("boardCtrl",boardCtrl),angular.module("qradarEditor").controller("editComponentCtrl",editComponentCtrl),angular.module("qradarEditor").controller("maintenanceModalCtrl",maintenanceModalCtrl),angular.module("qradarEditor").directive("draggable",function(){return function(a,b){var c=b[0];c.draggable=!0,c.addEventListener("dragstart",function(a){return a.dataTransfer.effectAllowed="move",a.dataTransfer.setData("id",this.id),this.classList.add("drag"),!1},!1),c.addEventListener("dragend",function(){return this.classList.remove("drag"),!1},!1)}}),angular.module("qradarEditor").directive("droppable",function(){return{scope:{droppable:"="},link:function(a,b){var c=b[0];c.addEventListener("dragover",function(a){return a.dataTransfer.dropEffect="move",a.preventDefault&&a.preventDefault(),!1},!1),c.addEventListener("drop",function(c){c.stopPropagation&&c.stopPropagation();var d=document.getElementById(c.dataTransfer.getData("id")),e=a.droppable;return"function"==typeof e&&a.droppable(d,b[0],c),!1},!1)}}}),function(){function a(){function a(a,c,d){var e=b(a.graph,c[0]);e.on("cell:pointerclick",function(a,b,c,d){}),e.on("cell:pointerclick",function(a,b,c,d){}),e.on("blank:pointerclick",function(a,b,c){}),e.on("link:options",function(a,b,c,d){});var f=c[0];f.addEventListener("dragover",function(a){return a.dataTransfer.dropEffect="move",a.preventDefault&&a.preventDefault(),!1},!1),f.addEventListener("drop",function(b){b.stopPropagation&&b.stopPropagation();var d=document.getElementById(b.dataTransfer.getData("id")),e=a.drop;return"function"==typeof e&&a.drop(d,c[0],b),!1},!1)}function b(a,b){var c=new joint.dia.Paper({el:b,width:3e3,height:3e3,gridSize:1,model:a,multiLinks:!1,restrictTranslate:!0,linkConnectionPoint:joint.util.shapePerimeterConnectionPoint,interactive:{arrowheadMove:!1}});return c}var c={link:a,restrict:"A",scope:{graph:"=",drop:"="}};return c}angular.module("qradarEditor").directive("jointDiagram",a)}(),angular.module("qradarEditor").service("componentFetcher",componentFetcher),angular.module("qradarEditor").service("componentFactory",componentFactory),angular.module("qradarEditor").service("selectedComponents",function(){this.components={},this.setPartNumbers=function(a){angular.forEach(this.components,function(b){b.partNumbers={product:[],capacityIncrease:[],formatedCapacityIncreases:[]},angular.forEach(a[b.name],function(a){b.partNumbers[a.partNumberType].push(a)}),angular.forEach(_.countBy(b.partNumbers.capacityIncrease,"partNumber"),function(a,c){b.partNumbers.formatedCapacityIncreases.push({times:a,capacityIncrease:_.find(b.partNumbers.capacityIncrease,{partNumber:c})})})})},this.getElementName=function(a){if(void 0===this.components[a])return a;var b,c=a.split("_"),d=c.length;return b=d>1&&parseInt(c[d-1],10)>0?c.slice(0,d-1).join("_")+"_"+(Number(c[d-1])+1):a+"_1",this.getElementName(b)}}),angular.module("qradarEditor").factory("jointLink",jointLink),angular.module("qradarEditor").service("jsonParser",jsonParser),angular.module("qradarEditor").factory("jointElement",jointElement),angular.module("qradarForm",["ngRoute","formly","formlyBootstrap","ngAnimate","ngMessages","ui.grid","ui.bootstrap","ui.grid.autoResize","ui.grid.selection","ui.grid.edit","ui.grid.rowEdit","ui.grid.validate","ui.grid.resizeColumns"]).config(function(a){a.setType({name:"repeatSite",templateUrl:"modules/form/views/site.html",controller:"RepeatSiteCtrl"}),a.setType({name:"repeatProduct",templateUrl:"modules/form/views/repeatProduct.html",controller:"RepeatProductCtrl"}),a.setType({name:"ui-grid",templateUrl:"modules/form/views/productsGrid.html",controller:"ProductsGridCtrl",wrapper:["bootstrapLabel","bootstrapHasError"]}),a.setType({name:"add-product",template:'<button style="margin: 0px ;" type="button" ng-disabled="disable()" class="btn btn-primary"  ng-click="add()">Ajouter</button>',controller:"AddProductCtrl"}),a.setWrapper({name:"panel",templateUrl:"modules/form/views/sites.html"}),a.setWrapper([{name:"validation",types:["input","select"],templateUrl:"modules/form/views/templates/error-messages.html"}])}).run(function(a,b){a.extras.errorExistsAndShouldBeVisibleExpression="fc.$touched || form.$submitted",b.addStringMessage("required","ce champ est obligatoire"),b.addStringMessage("min","should be greater than 0"),b.addStringMessage("number","Invalid Input"),b.addTemplateOptionValueMessage("max","max","The max value allowed is","","Too big"),b.addTemplateOptionValueMessage("pattern","patternValidationMessage","","","Invalid Input")}).config(function(a){a.when("/form",{templateUrl:"modules/form/views/main.html",controller:"MainCtrl",controllerAs:"vm"})}),angular.module("qradarForm").controller("MainCtrl",MainCtrl),angular.module("qradarForm").factory("Family",Family),angular.module("qradarForm").factory("Product",Product),angular.module("qradarForm").factory("productType",productType),angular.module("qradarForm").factory("familyManager",familyManager),angular.module("qradarForm").factory("productManager",productManager),angular.module("qradarForm").factory("typeManager",typeManager),angular.module("qradarForm").factory("formlyBuilder",formlyBuilder),angular.module("qradarForm").controller("RepeatSiteCtrl",RepeatSiteCtrl),angular.module("qradarForm").service("configService",configService),angular.module("qradarForm").controller("RepeatProductCtrl",RepeatProductCtrl),angular.module("qradarForm").controller("ProductsGridCtrl",ProductsGridCtrl),angular.module("qradarForm").controller("AddProductCtrl",AddProductCtrl);