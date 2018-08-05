
(function (core, doc,undefined) {

	var modules = {};
	var noop = function () {};

	fixConsole();

	function isType(type) {
		return function (o) {
			return Object.prototype.toString.call(o) === '[object ' + type + ']';
		};
	}

	var hasOwn = Object.prototype.hasOwnProperty;
	var isArray = isType('Array');

	if (typeof Array.prototype.forEach !== 'function') {
		Array.prototype.forEach = function (fn, context) {
			for (var k = 0, length = this.length; k < length; k++) {
				if (typeof fn === 'function' && hasOwn.call(this, k)) {
					fn.call(context, this[k], k, this);
				}
			}
		};
	}

	function Define(id, factory) {
		if (modules[id]) {
			alert('modules: ' + id + ' already exists!!');
			return;
		}
		if (!(this instanceof Define)) {
			return new Define(id, factory);
		}

		if (!modules[id]) {
			this.id = id;
			this.factory = factory || noop;
			modules[id] = this;
			return this;
		}
	}

	function require(ids, callback) {
		var result = [], mod = null, exp;
		(isArray(ids) ? ids : [ids]).forEach(function (id) {
			mod = modules[id];
			if (!mod) {
				window.alert('modules: ' + id + ' is not found!!');
				throw new Error('modules: ' + id + ' is not found!!');
			}
			if (!mod.exports) {
				var factory = mod.factory;
				exp = factory.call(null, require, mod.exports || (mod.exports = {}), mod);
				if (typeof exp !== 'undefined') {
					mod.exports = exp;
					mod.factory = null;
				} else {
					mod.exports = {};
				}
			}
			result.push(mod.exports);
		});

		return callback ? callback.apply(null, result) : result[0];
	}


	function fixConsole(){
		if (!window.console){
			var method;
			var methods = [
				'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
				'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
				'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
				'timeStamp', 'trace', 'warn'
			];
			var length = methods.length;
			var console = (window.console = window.console || {});
			while (length--) {
				method = methods[length];
				if (!console[method]) {
					console[method] = noop;
				}
			}
		}
	};


	function getCurrentScript () {
		var script, scripts, url,theme,width,height;
		if (doc.currentScript) {
			script = doc.currentScript;
		} else {
			scripts = doc.getElementsByTagName('script');
			script = scripts[scripts.length - 1];
		}

		url = script.hasAttribute ? script.src : script.getAttribute('src', 4);
		theme = script.theme || script.getAttribute('theme');
		width = script.width || script.getAttribute('width');
		height = script.width || script.getAttribute('height');

		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
				script.onload = script.onreadystatechange = null;
			}
		};
		return {
			url: url,
			theme: theme,
			width:width,
			height:height
		};
	}

	var scriptAttrs= getCurrentScript();
	console.log("[CKToolBar]getCurrentScript:",scriptAttrs);

	core.define = Define;
	core.require = require;

	core.plugins ={};
	core.version ="0.0.2";
	core.id = 'ck-toolBar';
	core.cacheData = {scriptAttrs:scriptAttrs};

	core.config = function (conf){
		require('config').initialize(conf);
	};

	if(!window.CKToolBar) {
		window.CKToolBar = core;
    CKToolBar.__modules = modules;
	}
})({},document);
;CKToolBar.define("const",function(){
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
;CKToolBar.define("utils", function (require) {
  var doc = document, win = window;
  var hasOwn = Object.prototype.hasOwnProperty;
  var slice = Array.prototype.slice;
  var htmlHead = doc.head || doc.getElementsByTagName('head')[0];
  var isIE = !!win.ActiveXObject;
  var isIE8 = isIE && !!doc.documentMode;
  var isIE6 = isIE && !win.XMLHttpRequest;
  var isIE7 = isIE && !isIE6 && !isIE8;
  var isCssLoaded = false;

  var _templatesCache = {};

  var isReady = false, readyList = [], timer;

  function onDOMReady() {
    for (var i = 0; i < readyList.length; i++) {
      readyList[i].apply(doc);
    }
    readyList = null;
  }

  function bindReady() {
    if (isReady) {
      return;
    }
    isReady = true;
    onDOMReady.call(win);
    if (doc.removeEventListener) {
      doc.removeEventListener('DOMContentLoaded', bindReady, false);
    } else if (doc.attachEvent) {
      doc.detachEvent('onreadystatechange', bindReady);
      if (win === win.top) {
        clearInterval(timer);
        timer = null;
      }
    }
  }

  if (doc.addEventListener) {
    doc.addEventListener('DOMContentLoaded', bindReady, false);
  } else if (doc.attachEvent) {
    doc.attachEvent('onreadystatechange', function () {
      if ((/loaded|complete/).test(doc.readyState)) {
        bindReady();
      }
    });
    if (win === win.top) {
      timer = setInterval(function () {
        try {
          isReady || doc.documentElement.doScroll('left');//在IE下用能否执行doScroll判断 dom是否加载完毕
        }
        catch (e) {
          console.error(e);
          return;
        }
        bindReady();
      }, 5);
    }
  }

  function isType(type) {
    return function (o) {
      return Object.prototype.toString.call(o) === '[object ' + type + ']';
    };
  }

  var isObject = isType('Object');
  var isArray = Array.isArray || isType('Array');

  function globalEval(e) {
    e && /\S/.test(e) && (win.execScript || function (e) {
      win.eval.call(win, e)
    })(e)
  }

  function safeEval(callback) {
    if (callback && typeof callback == 'function') {
      var t, a = "a" + new Date().getTime();
      return globalEval(["(function(){try{window.", a, "=", callback, ";}catch(_oError){}})();"].join("")), t = win[a], win[a] = null, t;
    }
  }

  function createStyleSheet() {
    var style = doc.createElement('style');
    style.type = 'text/css';
    htmlHead.appendChild(style);
    return style.sheet || style.styleSheet;
  }

  function createForm(id, action) {
    var submitForm = doc.createElement("form");
    submitForm.style.display = "none";
    submitForm.id = id + "-form";
    submitForm.name = id + "-form";
    submitForm.method = "POST";
    submitForm.action = action;
    submitForm.target = id;
    return submitForm;
  }

  var addCssRule = function () {
    // 创建 stylesheet 对象
    var sheet = createStyleSheet();
    // 返回接口函数
    return function (selector, rules, index) {
      index = index || 0;
      if (sheet.insertRule) {
        sheet.insertRule(selector + "{" + rules + "}", index);
      } else if (sheet.addRule) {
        sheet.addRule(selector, rules, index);
      }
    }
  }();

  function applyIf(proto, method) {
    if (proto) {
      for (var p in method) {
        if (!proto[p]) {
          proto[p] = method[p];
        }
      }
    }
  }

  applyIf(Date.prototype, {
    Format: function (fmt) {
      var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    }
  });
  applyIf(String.prototype, {
    trim: function () {
      return this.replace(/(^\s*)|(\s*$)/g, '');
    },
    escapeHTML: function () {
      return this.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    },
    escapeScript: function () {
      return this.replace(/(onerror|onunload)=[^<]*(?=\>)/gi, '').replace(/<script.*?>.*?<\/script>/ig, '');
    }
  });
  applyIf(Array.prototype, {
    forEach: function (fun) {
      var len = this.length;
      if (typeof fun != "function") {
        throw new TypeError();
      }
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in this) {
          fun.call(thisp, this[i], i, this);
        }
      }
    },
    indexOf: function (elt) {
      var len = this.length;
      var from = Number(arguments[1]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);
      if (from < 0) {
        from += len;
      }
      for (; from < len; from++) {
        if (from in this && this[from] === elt) {
          return from;
        }
      }
      return -1;
    },
    filter: function (fun, thisp) {
      var len = this.length;
      if (typeof fun !== 'function') {
        throw new TypeError();
      }
      var res = [];
      for (var i = 0; i < len; i++) {
        if (i in this) {
          var val = this[i]; // in case fun mutates this
          if (fun.call(thisp, val, i, this)) {
            res.push(val);
          }
        }
      }
      return res;
    },
    map: function (fun) {
      var len = this.length;
      if (typeof fun !== 'function') {
        throw new TypeError();
      }
      var res = new Array(len);
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in this) {
          res[i] = fun.call(thisp, this[i], i, this);
        }
      }
      return res;
    }
  });

  return {
    isIE6: isIE6,
    isIE7: isIE7,
    isObject: isObject,
    isArray: isArray,
    isEmptyObject: function (obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    },
    extend: function () {
      var target = arguments[0] || {}, i = 1, args = arguments.length, src, prop;
      if (args === i) {
        target = this;
        --i;
      }
      while ((src = arguments[i++])) {
        for (prop in src) {
          if (hasOwn.call(src, prop)) {
            target[prop] = src[prop];
          }
        }
      }
      return target;
    },
    addEvent: function (el, type, fn, phase) {
      if (typeof el === 'string') {
        el = doc.getElementById(el);
      }
      if (doc.dispatchEvent) {
        el.addEventListener(type, fn, !!phase);
        return fn;
      } else {
        el.attachEvent && el.attachEvent('on' + type, fn);
        return fn;
      }
    },
    removeEvent: function (obj, eventType, func) {
      if (typeof obj === 'string') {
        obj = doc.getElementById(obj);
      }
      if (obj.detachEvent) {
        obj.detachEvent("on" + eventType, func);
      } else {
        obj.removeEventListener(eventType, func, false);
      }
    },
    loadRemoteJS: function (url, success) {
      var done = false;
      var domScript = doc.createElement('script');
      var header = doc.getElementsByTagName('head')[0];
      domScript.src = url;
      success = success || function () {
        };
      domScript.onload = domScript.onreadystatechange = function () {
        if (!done && (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState)) {
          done = true;
          success();
          this.onload = this.onreadystatechange = null;
          //this.parentNode.removeChild(this);
        }
      };
      try {
        //doc.getElementsByTagName('head')[0].appendChild(domScript);
        domScript.parentNode.insertBefore(header, domScript);
      } catch (e) {
        doc.body.appendChild(domScript);
      }
    },
    getCurrentScript: function () {
      var script, scripts, url, theme, width, height, callback;
      if (doc.currentScript) {
        script = doc.currentScript;
      } else {
        scripts = doc.getElementsByTagName('script');
        script = scripts[scripts.length - 1];
      }
      url = script.hasAttribute ? script.src : script.getAttribute('src', 4);
      theme = script.theme || script.getAttribute('theme');
      width = script.width || script.getAttribute('width');
      height = script.width || script.getAttribute('height');
      callback = script.success || script.getAttribute('success');
      /**
       * cikeBar加载完成后触发callback属性
       * @type {Function}
       */
      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          safeEval(callback);
          script.onload = script.onreadystatechange = null;
        }
      };
      return {
        url: url,
        theme: theme,
        width: width,
        height: height
      };
    },
    getScriptParams: function (url) {
      var vars = {};
      url.toString().replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
      });
      return vars;
    },
    queryStringify: function (params) {
      var result = [];
      for (var key in params) {
        result.push(key + '=' + params[key]);
      }
      return result.join('&');
    },
    appendUrlParams: function (url, args) {
      args = typeof args === 'object' ? this.queryStringify(args) : args;
      return (url + '&' + args).replace(/[&?]{1,2}/, '?');
    },
    simpleBuild: function (ftl, data, safe) {
      if (!data) {
        return ftl;
      }
      var str = [], regs = /\\?\{+([^{}]+)\}+/gim, result = '';
      var source = isArray(data) ? data : [data];
      for (var i = 0, len = source.length; i < len; i++) {
        str.push(ftl.replace(regs, function (match, name) {
          var val = source[i][name];
          return val ? val : '';
        }));
      }
      result = str.join('');
      return result.escapeScript();
    },
    delay: function (func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function () {
        return func.apply(null, args);
      }, wait);
    },
    listen: function (evt, callback) {
      if (win.addEventListener) {// 非IE
        win.addEventListener(evt, callback, false);
      } else {// IE
        win.attachEvent('on' + evt, callback);
      }
    },
    createPostForm: function (id, action, inputObj) {
      var submitForm = createForm(id, action);
      var length = inputObj.length;
      while (length--) {
        var newElement = doc.createElement("input");
        newElement.type = "hidden";
        newElement.name = inputObj[length].name;
        newElement.value = inputObj[length].value;
        submitForm.appendChild(newElement);
      }
      doc.body.appendChild(submitForm);
      return submitForm;
    },
    addStyle: function (rules) {
      if (!rules) {
        return
      }
      var styleElement = doc.createElement('style');
      styleElement.type = 'text/css';
      if (isIE) {
        styleElement.styleSheet.cssText = rules;
      } else {
        var frag = doc.createDocumentFragment();
        frag.appendChild(doc.createTextNode(rules));
        styleElement.appendChild(frag);
      }
      //IE 无法取到document
      if (!isIE || isCssLoaded) {
        htmlHead.appendChild(styleElement)
      } else {
        win.attachEvent('onload', function () {
          isCssLoaded = true;
          htmlHead.appendChild(styleElement)
        });
      }
    },
    expireTime: function (expireIn) {
      return (new Date().getTime()) + (expireIn - 20) * 1000;
    },
    randomString: function () {
      return Math.random().toString(36).substr(2);
    },
    getElementByClassName: function (ele, className) {
      var divs = ele.getElementsByTagName("div"), length = divs.length;
      while (length--) {
        var div = divs[length];
        if (div.className == className) {
          return divs[length];
        }
      }
    },
    getIframeContentDocumentById: function (iframeId) {
      try {
        return doc.getElementById(iframeId).contentDocument || win.frames[iframeId].document;
      } catch (e) {
        return {err: "fail", errMsg: e.message}
      }
    },
    setStyle: function (obj, styleObj) {
      for (var key in styleObj) {
        obj.style[key] = styleObj[key];
      }
    },
    cache: function (key, val) {
      var argsLength = arguments.length;
      if (argsLength == 2) {
        CKToolBar.cacheData[key] = val;
      } else if (argsLength == 1) {
        return CKToolBar.cacheData[key];
      } else {
        return CKToolBar.cacheData;
      }
    },
    addCssRule: addCssRule,
    templates: function (str, data) {
      var that = this;
      var fn = !/\W/.test(str) ? _templatesCache[str] = _templatesCache[str] || that.templates(str) :
        new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
          "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
          + "');}return p.join('');");
      return data ? fn(data) : fn;
    },
    ready: function (fn) {
      if (isReady) {
        fn.call(doc);
      } else {
        readyList.push(function () {
          return fn.call(this);
        });
      }
      return this;
    },
    getElementsByClass:function(searchClass,node,tag) {
      node = node || doc;
      tag = tag || '*';
      var returnElements = []
      var els =  (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag);
      var i = els.length;
      searchClass = searchClass.replace(/\-/g, "\\-");
      var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
      while(--i >= 0){
        if (pattern.test(els[i].className) ) {
          returnElements.push(els[i]);
        }
      }
      return returnElements;
    }
  }
});;CKToolBar.define("htmlTemplate",function(){

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
;CKToolBar.define("css",function(require){

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

});;CKToolBar.define("draggable",function(require){

  var doc =document;
  var win =window;
  var layIndex = 1001;
  var CK_utils = require('utils');

  function getStyle(obj,attr){
    if(obj.currentStyle){
      return parseFloat( obj.currentStyle[attr]) || 0;
    }
    return parseFloat(win.getComputedStyle(obj)[attr]) || 0;
  }

  var E = {
    on : function(el, type, fn){
      el.addEventListener ?
      el.addEventListener(type, fn, false) :
      el.attachEvent ?
      el.attachEvent("on" + type, fn) :
      el['on'+type] = fn;
    },
    un : function(el,type,fn){
      el.removeEventListener ?
      el.removeEventListener(type, fn, false) :
      el.detachEvent ?
      el.detachEvent("on" + type, fn) :
      el['on'+type] = null;
    },
    evt : function(e){
      return e || win.event;
    }
  };

  var Dragdrop = function(){
    return function(opt){
      var conf = null, defaultConf, diffX, diffY;
      function Config(opt){
        this.target = opt.target;
        this.bridge = opt.bridge;
        this.dragable = opt.dragable != false;
        this.dragX = opt.dragX != false;
        this.dragY = opt.dragY != false;
        this.area  = opt.area;
        this.callback = opt.callback;
      }

      function Dragdrop(opt){
        if(!opt){return;}
        conf = new Config(opt);
        defaultConf = new Config(opt);
        conf.bridge ? E.on(conf.bridge,'mousedown',mousedown) : E.on(conf.target,'mousedown',mousedown);
      }

      Dragdrop.prototype = {
        dragX : function(){
          conf.dragX = true;
          conf.dragY = false;
        },
        dragY : function(b){
          conf.dragY = true;
          conf.dragX = false;
        },
        dragAll : function(){
          conf.dragX = true;
          conf.dragY = true;
        },
        setArea : function(a){
          conf.area = a;
        },
        setBridge : function(b){
          conf.bridge = b;
        },
        setDragable : function(b){
          conf.dragable = b;
        },
        reStore : function(){
          conf = new Config(defaultConf);
          conf.target.style.top = '0px';
          conf.target.style.left = '0px';
        },
        getDragX : function(){
          return conf.dragX;
        },
        getDragY : function(){
          return conf.dragY;
        }
      }

      function mousedown(e){
        e = E.evt(e);
        var el = conf.target;
        el.style.zIndex = layIndex++;
        if(el.setCapture){ //IE
          E.on(el, "losecapture", mouseup);
          el.setCapture();
          e.cancelBubble = true;
        }else if(win.captureEvents){ //标准DOM
          e.stopPropagation();
          E.on(win, "blur", mouseup);
          e.preventDefault();
        }
        diffX = e.clientX - el.offsetLeft;
        diffY = e.clientY - el.offsetTop;
        E.on(doc,'mousemove',mousemove);
        E.on(doc,'mouseup',mouseup);
      }
      function mousemove(e){
        var el = conf.target, e = E.evt(e), moveX = e.clientX - diffX, moveY = e.clientY - diffY;
        var minX, maxX, minY, maxY;
        if(conf.area){
          minX = conf.area[0];
          maxX = conf.area[1];
          minY = conf.area[2];
          maxY = conf.area[3];
          moveX < minX && (moveX = minX); // left 最小值
          moveX > maxX && (moveX = maxX); // left 最大值
          moveY < minY && (moveY = minY); // top 最小值
          moveY > maxY && (moveY = maxY); // top 最大值
        }
        if(conf.dragable){
          conf.dragX && (el.style.left = moveX + 'px');
          conf.dragY && (el.style.top =  moveY + 'px');
          if(conf.callback){
            var obj = {moveX:moveX,moveY:moveY};
            conf.callback.call(conf,obj);
          }
        }
      }
      function mouseup(e) {
        var el = conf.target;
        el.style.zIndex = getStyle(el,"z-index");
        E.un(doc,'mousemove',mousemove);
        E.un(doc,'mouseup',mouseup);
        if(el.releaseCapture){ //IE
          E.un(el, "losecapture", mouseup);
          el.releaseCapture();
        }
        if(win.releaseEvents){ //标准DOM
          E.un(win, "blur", mouseup);
        }
      }
      return new Dragdrop(opt);
    }
  }();

  return {
    initialize:function(opts){
      var ele  = doc.getElementById(opts.id);
      if(ele) {
        var bridge = CK_utils.getElementByClassName(ele,"ck-component-drag-bar");
        return new Dragdrop({target :ele,bridge:bridge});
      }
    }
  }
});
;CKToolBar.define("ui",function(require){

  var doc = document;
  var CK_css = require("css");
  var CK_utils = require("utils");
  var CK_const = require("const");
  var CK_draggable = require("draggable");
  var CK_htmlTemplate = require("htmlTemplate");

  /**
   * CKToolBar对象引用
   * @type {null}
   */
  var CKToolBarReference = null;
  var CKComponents = null;

  /**
   * 自定义点击事件缓存
   * @type {{}}
   */
  var customEventsMap ={};
  /**
   * script标签中的数据
   */
  var scriptAttrs = CK_utils.cache('scriptAttrs');
  var scriptQuery = CK_utils.getScriptParams(scriptAttrs.url);

  /**
   * 创建工具条
   * @param config
   * @returns {Element}
   */
  function createToolBar(config){
    var elementId = config.elementId;
    var wrapDiv = doc.createElement('div');
    var toolBarDiv = doc.createElement('div');
    toolBarDiv.innerHTML = createCustomButtons(config.buttons) + createComponentButtons(config.components);
    if(!elementId) {
      elementId = CKToolBar.id;
      if(scriptAttrs.theme){
        wrapDiv.className = CK_const.theme_class_prefix+"-"+scriptAttrs.theme;
      }
      wrapDiv.style.cssText = CK_const.css_reset;
      CK_css.initialize(scriptAttrs,wrapDiv.className);
    }
    toolBarDiv.setAttribute('id',elementId);
    CKToolBarReference = toolBarDiv;
    wrapDiv.appendChild(toolBarDiv);
    doc.body.insertBefore(wrapDiv, doc.body.firstChild);
  }

  /**
   * 创建用户buttons
   * @param buttons
   * @returns {*}
   */
  function createCustomButtons(buttons){
    buttons.forEach(function(btn,num) {
      if (btn.click && typeof btn.click == "function"){
        customEventsMap[CK_const.events_prefix+num] = btn.click;
      }
    });
    return CK_utils.templates(CK_htmlTemplate.button,{buttons:buttons});;
  }

  /**
   * 创建组件buttons
   * @param components
   * @returns {*}
   */
  function createComponentButtons(components){
    CKComponents = components;
    return CK_utils.templates(CK_htmlTemplate.component,{components:components});
  }

  /**
   * 绑定button的点击事件
   */
  function bindButtonEvent(){
    var buttons = CKToolBarReference.getElementsByTagName('a'),length = buttons.length;
    while (length--) {
      var btn = buttons[length];
      if(btn.className == CK_const.component_prefix){
        _componentEvent(btn);
      } else{
        _customEvent(btn);
      }
    }
  }

  /**
   * 组件类型点击事件
   * @param btn
   * @private
   */
  function _componentEvent(btn){
    CK_utils.addEvent(btn,'click',function() {
      var isinit = btn.getAttribute("data-component-init");
      if(isinit == "true"){
        displayComponent(btn.getAttribute("data-component-id"));
        console.log("组件["+btn.getAttribute("data-component-name")+"]已经加载了->",isinit);
      } else {
        initComponentContent(btn);
      }
    });
  }

  /**
   * 普通类型点击事件
   * @param btn
   * @private
   */
  function _customEvent(btn){
    var eventHook = btn.getAttribute("data-custom-events");
    if(eventHook){
      CK_utils.addEvent(btn,"click",function(e){
        customEventsMap[CK_const.events_prefix+eventHook].call(btn,e);
      });
    }
  }

  /**
   * 初始化组件
   * @param btn
   */
  function initComponentContent(btn){
    var componentName = btn.getAttribute('data-component-name');
    var component = CKComponents[componentName];

    //todo FIX
    if(componentName == 'softphone'){
      component.width = "300px";
      component.height = "350px";
      component.html = CK_htmlTemplate.phone;
    }
    if(doc.getElementById(component.id)) {
      return console.log("[component is loading...]:",component);
    }
    switch (component.type) {
      case "common":
        _createCommonComponent(component);
        break;
      case "service":
        _createServiceComponent(component);
        break;
    }
    //todo 优化
    if(!component.html){
      setComponentStatus(component.id,function(err,iframeContent){
        btn.setAttribute("data-component-init","true");
      });
    }
  }

  /**
   * service类型组件需要创建form提交数据
   * @param component
   * @private
   */
  function _createServiceComponent(component){
    _createCommonComponent(component);
    var submitVal = _buildSubmitValue();
    CK_utils.delay(function(){
      var form = CK_utils.createPostForm(component.id,component.url,submitVal);
      form.submit();
      form.parentNode.removeChild(form);
    },500);
  }

  /**
   * comm类型组件
   * @param component
   * @private
   */
  function _createCommonComponent(component){
    component.drag = true;
    var id = _getDragId(component);
    var content = component.html ? component.html : createIframe(component);
    _buildIt(id,component,content);
  }

  /**
   * 构造拖拽div和组件框
   * @param id
   * @param component
   * @param content
   * @returns {*}
   * @private
   */
  function _buildIt(id,component,content) {
    var divElement = doc.createElement('div');
    divElement.setAttribute("id",id);
    //<!- 创建拖拽 div ->
    if(component.drag == true){
      var divContent = _buildContent(divElement,component,content);
      _buildTitle(divElement,component);
      doc.body.insertBefore(divElement, doc.body.firstChild);
      CK_utils.delay(function(){CK_draggable.initialize({id:_getDragId(component)});},CK_const.comm_time);
      return divContent;
    } else {
      //<!- 创建普通 div ->
      divElement.className = CK_const.component_wrapper_class;
      divElement.innerHTML = content ||"";
      doc.body.insertBefore(divElement, doc.body.firstChild);
      return divElement;
    }
  }

  /**
   * 创建组件iframe,service类型不需要src
   * @param component
   * @returns {*}
   */
  function createIframe(component) {
    var params ={id:component.id, name:component.id};
    if(component.type == "common") {
      params.src =component.url;
    }
    return CK_utils.simpleBuild(CK_htmlTemplate.iframe,params);
  }

  /**
   * 设置组件加载完成后的状态
   * @param id
   * @param ele
   * @param callback
   */
  function setComponentStatus(id,callback) {
    CK_utils.delay(function () {
      var iframe = doc.getElementById(id) || null;
      if (!iframe) {return console.error('iframe:'+id +'找不到');}
      var tagName = iframe.tagName.toLowerCase();
      if(tagName !== 'iframe'){return console.error('元素类型错误:',tagName);}
      var onloadCallback = function(){
        var iframeContent = CK_utils.getIframeContentDocumentById(id);
        if(iframeContent.err && (iframeContent.err == 'fail')){
          callback && callback(iframeContent,null);
        } else {
          callback && callback(null,iframeContent);
        }
      };
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', onloadCallback);
      } else {
        iframe.onload = onloadCallback;
      }
    },CK_const.comm_time);
  }

  /**
   * 创建拖拽id
   * @param component
   * @returns {string}
   * @private
   */
  function _getDragId(component){
    if(typeof component == "string"){
      return component + "-drag-div";
    } else {
      return component.drag ? (component.id + "-drag-div") : (component.id+"-div");
    }
  }

  /**
   * 构建表单提交数据 [{"cid":"gh_xxxx","appid":"wx001"},{}]
   * @returns {Array}
   */
  function _buildSubmitValue(){
    var inputValList = [];
    for(var key in scriptQuery){
      if(scriptQuery.hasOwnProperty(key)){
        inputValList.push({
          name:key, value:scriptQuery[key]
        })
      }
    }
    return inputValList;
  }

  /**
   * 标题
   * @param divElement
   * @private
   */
  function _buildTitle(divElement,component){
    var divTitle = CK_utils.getElementByClassName(divElement,"ck-component-drag-bar");
    divTitle.innerHTML = component.title + "<s class='ck-close'>×</s>";
  }

  /**
   * 容器
   * @param divElement
   * @private
   */
  function _buildContent(divElement,component,content){
    divElement.className = CK_const.component_drag_wrapper_class;
    divElement.innerHTML = CK_utils.simpleBuild(CK_htmlTemplate.draggableDiv,{
      w:component.width || CK_const.component_width,h:component.height || CK_const.component_height
    });
    var divContent = CK_utils.getElementByClassName(divElement,"ck-component-drag-content");
    divContent.innerHTML = content || "";

    /**
     * 绑定关闭按钮事件
     */
    CK_utils.addEvent(divElement,"click",function(e){
      if(e.target && e.target.className === "ck-close") {
        divElement.style.display = "none";
      }
    });

    return divContent;
  }

  /**
   * 显示组件
   * @param id
   */
  function displayComponent(id){
    if(!id){return}
    removeNotify(id);
    try {
      doc.getElementById(_getDragId(id)).style.display = "block";
    } catch (e){
    }
  }

  function addNotify(cname,num){
    //命名规则有点混乱需要重构
    var componentBtn = doc.getElementById(CK_const.component_btn+"-"+cname);
    if(!componentBtn){return}
    var notifySpan = CK_utils.getElementsByClass("ck-notify",componentBtn);
    if (notifySpan.length){
      notifySpan[0].innerHTML = parseInt(notifySpan[0].innerHTML) + (num || 1);
    } else {
      var span = doc.createElement('span');
      span.className = "ck-notify";
      span.innerHTML = num || 1;
      componentBtn.appendChild(span);
    }
  }

  function removeNotify(cname,num){
    var componentBtn = doc.getElementById(CK_const.component_btn+"-"+cname);
    if(!componentBtn){return}
    var notifySpan = CK_utils.getElementsByClass("ck-notify",componentBtn);
    if (notifySpan.length){
      if(num){
        notifySpan[0].innerHTML = parseInt(notifySpan[0].innerHTML) - (num || 1);
      } else {
        componentBtn.removeChild(notifySpan[0]);
      }
    }
  }

  return {
    addNotify:addNotify,
    removeNotify:removeNotify,
    initialize:function (config){
      createToolBar(config);
      CK_utils.delay(bindButtonEvent,CK_const.comm_time);
    }
  }
});
;CKToolBar.define("service",function(require){

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
;CKToolBar.define("config",function(require){
	var CK_service = require("service");

	return {
		initialize:function(conf){
			CK_service.initialize(conf);
		}
	}
});