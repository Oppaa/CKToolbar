CKToolBar.define("service",function(require){

	var CK_ui = require("ui");
	var CK_utils = require("utils");
	var CK_const = require("const");

  /**
   * 暴露内部模块快捷方式
   */
  function exportsModules (){
    CK_const.exportsMod.forEach(function(modName){
      var innerMod = CKToolBar.__modules[modName];
      if(innerMod && innerMod.exports){
        CKToolBar[modName] = innerMod.exports;
      }
    });
  }

  /**
   * components组件json加工,格式转换,并且生成唯一组件id
   * @param conf
   */
	function configConverter(conf) {
		var _config ={},componentsObj = {};
		var components = conf.components || [];
		try {
			components.forEach(function(com){
				com.id = CK_const.component_prefix+"-"+com.name;
				componentsObj[com.name] = com;
			});
		} catch (e){
			console.error("configConverter:",e);
			componentsObj = {};
		}
		_config['components'] = componentsObj;
		_config['buttons'] = conf.buttons || [];
		return _config;
	}

	return {
		initialize:function(conf){
      exportsModules();
      var config = configConverter(conf);
			CK_utils.ready(function(){CK_ui.initialize(config);})
		}
	}
});
