CKToolBar.define("const",function(){
	var component_prefix = 'ck-component';
  return {
    exportsMod:["ui"],
    component_btn:"btn-"+component_prefix,
    component_prefix:component_prefix,
		events_prefix:"ck-event-hook",
		theme_class_prefix:"ck-theme",
		component_wrapper_class:component_prefix+"-"+"div",
		component_drag_wrapper_class:component_prefix+"-"+"drag"+"-"+"div",
		css_reset:"font:normal normal normal 12px/1.2 'Microsoft Yahei';margin:0;padding:0;text-decoration:none",
    component_width:"600px",
    component_height:"400px",
    comm_time:7
  }
});
