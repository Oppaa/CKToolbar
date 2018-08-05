## 多媒体CKToolbar工具条

####  `功能`
	
> 工具条只是作为一个快捷入口,背后会提供各类常用服务.如:webrtc面对面视频,在线客服,在线坐席等,或者自己定义服务和事件


#### `近期准备更新`

1. 整合  [cross-domain.js](https://segmentfault.com/a/1190000015435530) 



#### `使用方法`

``` javascript

<body>
	<script width="500" height="500" src=./dist/shell.min.js></script>
	
	<script>CKToolBar.config(...)</script>
</body>

```

#### `CKToolBar.config 配置项`

``` javascript

CKToolBar.config({
	components:[
        {
           name:'webtrc',
           type:'common',
           title:"视频聊天",
           url: "http://118.24.31.195:3000/webrtc"
        },
        {
           name:'talk',
           type:'common',
           title:"在线客服",
           url: "http://118.24.31.195:3000/im"
        }
    ],
	buttons:[
        {	
			ico:"logo.jpg",
			title:"关注我们",
			href:"http://www.qq.com",
			image:"http://www.qq.com/qq.jpg"
			click:function(evt,btn){
				alert(btn.href)
			}
		},
		{...},
	]
});

```

#### `参数说明`

|参数|描述|是否可选|
|----|--- |--------|
|`components`|提供各类组件列表|是|

---

|参数|描述|是否可选|
|----|--- |--------|
|`buttons`|客户自定义按钮列表|是|
|ico|按钮图标|是|
|title|按钮标题|是|
|href|跳转连接|是|
|image|hover展示图片|是|
|click|自定义点击事件|是|

---


#### `模块介绍`


``` javascript

<!-- 开发模式 -->
<script src="./src/cross-domain.js"></script>        //跨域通信组件
<script src="./src/shell.core.js"></script>          //生成命名空间CKToolBar
<script src="./src/shell.utils.js"></script>         //工具类
<script src="./src/shell.const.js"></script>         //常量
<script src="./src/shell.html.js"></script>          //html模板
<script src="./src/shell.css.js"></script>           //css动态式样
<script src="./src/shell.drag.js"></script>          //拖拽功能模块
<script src="./src/shell.ui.js"></script>            //动态创建各类元素
<script src="./src/shell.service.js"></script>       //服务模块
<script src="./src/shell.config.js?appid=wx001&cid=gh_xxxx"></script> //配置入口模块


<!--生产模式-->
<!--<script src="./dist/shell.min.js?appid=wx001&cid=gh_xxxx"></script>-->


```

#### `如何开发`

``` javascript

<!--开始定义模块-->

CKToolBar.define("you_module_name_1",function(require){
  var CK_utils = require("utils");//已有模块
  return {
    say:function(){
      console.log("给本模块暴露的方法");
    }
  }
});

CKToolBar.define("you_module_name_2",function(require){
  var you_module = require('you_module_name_1');//自己的的模块
  you_module.say();
});

```
