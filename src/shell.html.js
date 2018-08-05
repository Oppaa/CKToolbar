CKToolBar.define("htmlTemplate",function(){

  /**
   * iframe模板
   * @type {string}
   */
  var iframeSimpleTemplate = '<iframe marginHeight="0" marginWidth="0" frameborder="0" scrolling="auto" width="100%" height="100%" src="{src}" id="{id}" name="{id}" allowtransparency="true" style="background-color:transparent"></iframe>';

  /**
   * 可拖拽div内部结构
   * @type {string}
   */
  var draggableDivTemplate = '<div class="ck-component-drag-main"> <div class="ck-component-drag-bar"></div> <div style="width:{w};height:{h};" class="ck-component-drag-content"></div></div>';

  /**
   * 自定义按钮
   * @type {string}
   */
  var buttonTemplate =
  '<% for (var i = 0;i<buttons.length;i++){%> ' +
  '<% if(buttons[i].href){ %>'+
  '<a class="ck-buttons" target="_blank" href="<%= buttons[i].href %>" data-custom-events="<%=buttons[i].click && i%>">' +
  '<%}else{%>'+
  '<a class="ck-buttons" href="javascript:void(0)" data-custom-events="<%=buttons[i].click && i%>">' +
  '<%}%>'+
  '<% if(buttons[i].title && buttons[i].ico){ %>'+
  '<i class="ck-title"><%=buttons[i].title%></i>'+
  '<i class="ck-ico" style="background:#ccc url(<%=buttons[i].ico%>) no-repeat left top;background-size:100% 100%"></i>' +
  '<%}else{%>'+
  '<% if(!buttons[i].ico){ %>'+
  '<i class="ck-title-fixed"><%=buttons[i].title%></i>'+
  '<%}%>'+
  '<% if(!buttons[i].title){ %>'+
  '<i class="ck-ico-fixed" style="background:#ccc url(<%=buttons[i].ico%>) no-repeat left top;background-size:100% 100%"></i>' +
  '<%}%>'+
  '<%}%>'+
  '<b style="height: 100%; vertical-align: middle; width: 0; display: inline-block;"></b>'+

  '<% if(buttons[i].image){ %>'+
  '<span class="ck-box" style="background:#ccc url(<%=buttons[i].image%>) no-repeat left top;background-size:100% 100%"></span>'+
  '<%}%>'+
  '</a>' +
  '<%}%>';


  /**
   * 组件类型的按钮
   * @type {string}
   */
  var componentsTemplate =
  '<% for (var name in components){%> '+
    '<a class="ck-component" href="javascript:void(0)" id="btn-<%=components[name].id%>" data-component-init="false" data-component-id="<%=components[name].id%>" data-component-name="<%=name%>" data-component-url="<%=components[name].url||"null"%>">' +
    '<% if(components[name].title && components[name].ico){ %>'+
    '<i class="ck-title"><%=components[name].title%></i>'+
    '<i class="ck-ico" style="background:#ccc url(<%=components[name].ico%>) no-repeat left top;background-size:100% 100%"></i>' +
    '<%}else{%>'+
    '<% if(!components[name].ico){ %>'+
    '<i class="ck-title-fixed"><%=components[name].title%></i>'+
    '<%}%>'+
    '<% if(!components[name].title){ %>'+
    '<i class="ck-ico-fixed" style="background:#ccc url(<%=components[i].ico%>) no-repeat left top;background-size:100% 100%"></i>' +
    '<%}%>'+
    '<%}%>'+
    '<b style="height: 100%; vertical-align: middle; width: 0; display: inline-block;"></b>'+
    '<% if(components[name].content){ %>'+
    '<span class="ck-content"><%=components[name].content%></span>'+
    '<%}%>'+
    '</a>' +
  '<%}%>';

  var phoneTemplate =
  '<div class="dial-plate">\
		<h4 class="dial-name">拨号盘</h4>\
		<div class="input-box"><input name="" class="dial-input"><i class="icon-25 input-delete" ng-click=""></i></div>\
		<ul class="digital-keyboard"><li>1</li><li>2</li><li>3</li><li>*</li><li>4</li><li>5</li><li>6</li><li>#</li><li>7</li><li>8</li><li>9</li><li>0</li></ul>\
		<div class="popup_foots"><div class="dial-btn call-icon">拨&nbsp;&nbsp;&nbsp;打</div><div class="dial-btn reset-ico">清&nbsp;&nbsp;&nbsp;空</div></div>\
		<a class="dial-close"></a><i class="arrow"></i>\
	</div>';

  return {
    button:buttonTemplate,
    component:componentsTemplate,
    iframe:iframeSimpleTemplate,
    draggableDiv:draggableDivTemplate,
    phone:phoneTemplate
  }
});
