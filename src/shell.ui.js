CKToolBar.define("ui",function(require){

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
