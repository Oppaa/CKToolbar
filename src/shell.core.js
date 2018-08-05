
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
