CKToolBar.define("css",function(require){

	var utils = require("utils");

  /**
   * 默认工具条和弹出层式样
   * @type {string}
   */

	var defaultCss =
	"#ck-toolBar {\
		position: fixed;\
		padding: 0 15px 20px;\
		width:25px;\
		top: 5%;\
		right: 0;\
		z-index: 999;\
		background-color: #fff;\
		box-shadow: 0 4px 12px 0 rgba(7,17,27,.1);\
		user-select:none;\
		text-align: center;\
	}\
	#ck-toolBar .ck-notify{\
		position: absolute;top:0;left:-20px;\
		width:18px;height:18px;line-height:18px;\
		background:#ff6868;border-radius: 50%;color:#fff;font-size:10px\
  }\
	#ck-toolBar .ck-buttons,#ck-toolBar .ck-component{\
		margin:0;padding:10px 0;\
		vertical-align: middle;\
		display: block;\
		color: #b5b9bc;\
		width:25px;height:25px;\
		border-bottom: 1px solid #edf1f2;\
	  text-decoration:none;\
    position:relative;\
    *zoom:1;\
	}\
	#ck-toolBar .ck-title,#ck-toolBar .ck-ico, #ck-toolBar .ck-title-fixed,#ck-toolBar .ck-ico-fixed{\
		width:25px;font-style:normal;vertical-align: middle;display: inline-block;\
	}\
	#ck-toolBar .ck-ico,#ck-toolBar .ck-ico-fixed{ height:25px;}\
	#ck-toolBar .ck-title { display: none;}\
	\
	#ck-toolBar .ck-buttons:hover .ck-ico,#ck-toolBar .ck-component:hover .ck-ico{display: none;}\
	#ck-toolBar .ck-buttons:hover .ck-title,#ck-toolBar .ck-component:hover .ck-title{display: inline-block;}\
	#ck-toolBar .ck-buttons .ck-box,#ck-toolBar .ck-component .ck-content {\
		position: absolute;\
		background:white;\
		width: 150px;height: 150px;bottom: 0px;right: 55px;\
		-webkit-transition: opacity .25s,transform .3s;\
		transition: opacity .25s,transform .3s;\
		opacity: 0;\
		filter: alpha(opacity=0);\
		max-width: 0;\
		-webkit-transform: scale(.01);\
		transform: scale(.01);\
		-webkit-transform-origin: 100% 95%;\
		transform-origin: 100% 95%;\
	}\
	#ck-toolBar .ck-buttons:hover .ck-box, #ck-toolBar .ck-component:hover .ck-content{\
		display: block;\
		visibility: visible;\
		opacity: 1;\
		filter: alpha(opacity=100);\
		max-width: none;\
		-webkit-transform: scale(1);\
		transform: scale(1);\
	}\
  .ck-component-div{overflow-y:scroll;background:white;margin:0;padding:0;font-size:12px;position:absolute;z-index:9000;left:0px;top:0px;}\
  .ck-component-drag-div{position:absolute; left:0; top:0; z-index:1000;padding:5px; background:#f0f3f9; font-size:12px; -webkit-box-shadow:2px 2px 4px #909090;}\
  .ck-component-drag-main{width:100%;height:100%;background:white;}\
  .ck-component-drag-bar{cursor:move;user-select:none;font-size:12px;color:#666;font-weight:normal;height:24px;padding:0;margin:0;line-height:24px; background:#f2f2f2;padding-left:5px; cursor:move;}\
  .ck-component-drag-bar .ck-close{color:#999;text-decoration:none;font-size:16px;position: absolute;right: 13px;top: 5px;cursor:pointer;font-family:simsun}\
  .ck-component-drag-content{padding:10px 5px;}";

  /**
   * 其他式样映射
   * @type {string}
   */
	var paicCss = "";
	var cssTheme = {
		"ck-theme-paic":paicCss
	};

	return {
		initialize:function(attr,className){
			console.log('[CKToolBar.css]:',className);
			utils.addStyle(cssTheme[className] || defaultCss);
		}
	}

});