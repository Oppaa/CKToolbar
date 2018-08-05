CKToolBar.define("utils", function (require) {
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
});