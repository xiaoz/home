// JavaScript Document
/*Function.prototype.bind=function(context){var argv=[arguments[0],this];var argc=arguments.length;for(var ii=1;ii<argc;ii++){argv.push(arguments[ii])}return bind.apply(null,argv)};

Function.prototype.shield=function(context){
	if(typeof this!='function'){
		throw new TypeException();
	}
	var bound=this.bind.apply(this,to_array(arguments));
	return function(){return bound()}
};
	
Function.prototype.defer=function(msec,clear_on_quickling_event){
	if(typeof this!='function'){
		throw new TypeError();
	}
	msec=msec||0;
	return setTimeout(this,msec,clear_on_quickling_event);
};

Number.prototype.toFixed=function(num){with(Math)return round(this.valueOf()*pow(10,num))/pow(10,num)};
*/
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(c, b) {
        if (b == null) {
            b = 0;
        } else {
            if (b < 0) {
                b = Math.max(0, this.length + b);
            }
        }
        for (var a = b; a < this.length; a++) {
            if (this[a] === c) {
                return a;
            }
        }
        return - 1;
    };
}
Array.prototype.inArray = function (value) {   
    var i;   
    for (i=0; i < this.length; i++){  
        if (this[i] === value){  
            return true;   
        }  
    }  
    return false;  
};

function setLocation(url) {
	window.location.href = url;
	try {
		window.event.returnValue = false;
	} catch(e) {
		//
	}
}

function confirmSetLocation(message, url){
    if( confirm(message) ) {
        setLocation(url);
    }
    return false;
}

function deleteConfirm(message, url) {
    confirmSetLocation(message, url);
}

function bind(obj, method) {
    var args = [];
    for (var ii = 2; ii < arguments.length; ii++) {
        args.push(arguments[ii]);
    }
    var fn = function() {
        var _obj = obj || (this == window ? false: this);
        var _args = args.slice();
        for (var jj = 0; jj < arguments.length; jj++) {
            _args.push(arguments[jj]);
        }
        if (typeof(method) == "string") {
            if (_obj[method]) {
                return _obj[method].apply(_obj, _args);
            }
        } else {
            return method.apply(_obj, _args);
          }
    };
    if (typeof method == 'string') {
        fn.name = method;
    } else if (method && method.name) {
        fn.name = method.name;
    }
    fn.toString = function() {
        return bind._toString(obj, args, method);
    };
    return fn;
};

bind._toString = bind._toString || 
function(obj, args, method) {
    return (typeof method == 'string') ? ('late bind<' + method + '>') : ('bound<' + method.toString() + '>');
};

function to_array(obj) {
    var ret = [];
    for (var i = 0, l = obj.length; i < l; ++i) {
        ret.push(obj[i]);
    }
    return ret;
};

Function.prototype.bind = function(context) {
    var argv = [arguments[0], this];
    var argc = arguments.length;
    for (var ii = 1; ii < argc; ii++) {
        argv.push(arguments[ii]);
    }
    return bind.apply(null, argv);
};
Function.prototype.shield = function(context) {
    if (typeof this != 'function') {
        throw new TypeException();
    }
    var bound = this.bind.apply(this, to_array(arguments));
    return function() {
        return bound();
    };
};
Function.prototype.defer = function(msec, clear_on_quickling_event) {
    if (typeof this != 'function') {
        throw new TypeError();
    }
    msec = msec || 0;
    return setTimeout(this, msec, clear_on_quickling_event);
};
Date.prototype.format = function(format)
    {
        var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length==1 ? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }

KISSY.app('H', function() {
	var S = KISSY, DOM = S.DOM,
        debug = (-1 === window.location.toString().indexOf('__debug')) ? false : true;

    return {

        /**
         * 版本号
         */
		version: '1.0',
		
		/*
		 * 存放公用方法等
		 * */
		util: {
			/*
			 * 页面刷新
			 * */
			pageReload: function( url ) {
				url = ( url || window.location.toString() ).replace(/t=(\d)+/g, '').replace(/([&|?])+$/, '');
				url = url + ( -1 === url.indexOf('?') ? '?' : '&' ) + 't=' + KISSY.now();
				return window.location = url;
			},
			/*
			 * 解析data.responseText, s === data.responseText
			 * @return {Object}
			 * */
			parseJSON: function( s ) {
				try {
					var result = new Function('return' + s.replace(/[\n|\t|\r]/g, ''))();
				} catch(e) { HLG.log( 'parse JSON error' ); }

				return result;
			},
			serialize: function( form ) {
				 
		    	var rselectTextarea = /select|textarea/i,
                    rinput = /hidden|password|text/i;
                var form = DOM.get(form);
				    els = DOM.children(form),
                    rt = {};
                S.each(els, function(el) {
                    if(el.name && !el.disabled &&(el.checked || rselectTextarea.test(el.nodeName)|| rinput.test(el.type))){
                            rt[el.name] = DOM.val(el);
                     }
                }); 
                return rt;
               	
			},
            /**
             * 切换小菊花 (假定小菊花在el的前面)
             * @param el
             */
            toggleFlower: function(el) {
                DOM.toggleClass([el, DOM.prev(el)], 'hidden');
            },
			saveTrack :function(btn,tag,url){
				Event.on(btn,'click',function(){
					KISSY.io.get(url,{
				    	name:tag
					});
				})
			}
		},

		/*
		 * 组件,
		 */
		widget: {},
		
        app:{}, 
        
        //粉丝会
        FSH: {},
		/**
         * PrinHLG debug info.
         * @param msg {String} the message to log.
         * @param cat {String} the log category for the message. Default
         *        categories are "info", "warn", "error", "time" etc.
         * @param src {String} the source of the the message (opt)
         * @return {HLG}
         */
		log: function( msg, cat, src ) {
			if (debug) {
                if (src) {
                    msg = src + ': ' + msg;
                }
                if (window['console'] !== undefined && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                }
            }
            return this;
		}
    };
});



 /* HLG.Dialog 简易模拟窗口
 * 
 * @creator     hlg<xiaohu@taobao.com>
 * @date		2011.05.21
 * @version		1.0
 */

H.add('widget~Dialog', function( HLG ) {
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document, IE = S.UA.ie,
		DP = Dialog.prototype, _id_counter = 0,
/* 默认HTML

<div class="ui-dialog ui-dialog-dd">
	<div class="ui-dialog-hd">hd</div>
	<div class="ui-dialog-bd">bd</div>
	<div class="ui-dialog-ft"><a class="close" href="#close" title="关闭"></a></div>
</div>
<div class="ui-dialog-mask"></div>
*/	
		defConfig = {
			ID: null,
			head: 'Title',
			body: '<div class="ui-dialog-loading">正在加载，请稍候...</div>',
			foot: '<a href="javascript:;" class="close">close</a>',
			center: true,
			width: '580px',
			zIndex: '1000002',
			keypress: true,
			mask: false,
			drag: false,
			maskClassName: 'ui-dialog-mask',
			close: true,
			className: 'ui-dialog',
			classNameHd: 'ui-dialog-hd',
		    classNameBd: 'ui-dialog-bd',
			classNameFt: 'ui-dialog-ft',
			scroll : true
		},
		/**
		 * 所有自定义事件列表
		 */
		CHANGE_HEADER = "changeHeader",	//修改hd
		CHANGE_BODY = "changeBody",		//修改bg
		CHANGE_FOOTER = "changeFooter",	//修改ft
		CENTER = "center",					//center后
		BEFORE_SHOW = "beforeShow",		//show之前
		SHOW = "show",						//show
		BEFORE_HIDE = "beforeHide",		//hide之前
		HIDE = "hide";						//hide

		
	function Dialog (config) {
		
		var self = this; 
        if (!(self instanceof Dialog)) { 
            return new Dialog(config); 
        }		
		this.config = S.merge(defConfig, config || {});
		var self = this, cfg = self.config, k ,DD;
		self._createHTML();
		if(true === cfg.keypress) Event.on(doc, 'keypress', function(evt) {
			if (27 === evt.keyCode && 200 === self._status) {
				self.hide();
			}
		});

	}
	//
	S.mix(DP, S.EventTarget);

	S.mix(DP, {
		
		/*
		 * 内部状态码 400为hide, 200为show
		 *
		 * */
		_status: 400,

		/**
		 * 居中 return this
		 */
		center: function() { 
			var self = this, elem = this.elem, x, y,
				elemWidth = elem.offsetWidth,
				elemHeight = elem.offsetHeight,
				viewPortWidth = DOM.viewportWidth(),
                viewPortHeight = DOM.viewportHeight();
               
            if (elemWidth < viewPortWidth) {
                x = (viewPortWidth / 2) - (elemWidth / 2) + DOM.scrollLeft();
            } else {
                x = DOM.scrollLeft();
            }

            if (elemHeight < viewPortHeight) {
                y = (viewPortHeight / 2) - (elemHeight / 2) + DOM.scrollTop();
            } else {
                y = DOM.scrollTop();
			}
            DOM.css(elem, { left: x, top: y });
			DOM.css(self.mask, 'height', DOM.docHeight() + 'px');
            self.fire( CENTER );
            return self;
		},
		
		/**
		 * setHeader
		 */
		setHeader: function(str) {
            var self = this;
            str = str + "";
			self.elemHead.innerHTML = str;	
			self.fire( CHANGE_HEADER );
			return self;
		},
		
		/**
		 * setbody
		 */
		setBody: function(str) {
            var self = this;
            if(str.nodeType) { // 如果是节点元素, 清空elemBody, 再插入节点元素
				self.elemBody.innerHTML = '';
				self.elemBody.appendChild(str);
			} else {
				str = str + "";
				self.elemBody.innerHTML = str;
            }
			self.fire( CHANGE_BODY );
			return self;
		},
		
		/**
		 * setFooter
		 */
		setFooter: function(str) {
            var self = this;
            str = str + "";
			self.elemFoot.innerHTML = str;
			self.fire( CHANGE_FOOTER );
			return self;
        },

		/**
		 * show
		 */
        show: function() {
			 
            var self = this, cfg = this.config;
            self.fire( BEFORE_SHOW );
			DOM.css(self.elem, "visibility", "");
			DOM.css(self.elem, "display", "");
			if(true === cfg.center) self.center();
			DOM.css(self.mask, "visibility", "");
			if(IE && 6 === IE) {
				DOM.addClass(doc.body, 'fix-select');
			}			
			self._status = 200;
			self.fire( SHOW );
			if (cfg.scroll) {
				var cen = function(){
					self.center();
				};
				window.onscroll = cen;
			}
			return self;
		},
		
		/**
		 * hide
		 */
        hide: function() {
            var self = this,  cfg = self.config;
			if ( 400 === self._status ) return;
		    self.fire( BEFORE_HIDE );
            //DOM.css(self.elem, "top", 0);
            DOM.css(self.elem, "display", "none");
			DOM.css(self.elem, "visibility", "hidden");
            DOM.css(self.mask, "visibility", "hidden");
            DOM.css(self.mask, "height", 0);
			if(IE && 6 === IE) {
				DOM.removeClass(doc.body, 'fix-select');
			}
			self._status = 400;
			self.fire( HIDE );
			return self;
		},
		
		align: function() {
			
		
		},
		
		
		_createHTML: function() {
			var self = this, cfg = self.config;
			self.elem = doc.createElement('dialog');
			self.elem.id = cfg.ID || 'ui-dialog-' + _id_counter++;
			self.elem.className = cfg.className;
			DOM.css(self.elem, 'width', cfg.width);
			DOM.css(self.elem, 'visibility', 'hidden');
			DOM.css(self.elem, 'z-index', cfg.zIndex);
			//hd
			self.elemHead = doc.createElement('hd');
			self.elemHead.className = cfg.classNameHd;
			self.elemHead.innerHTML = cfg.head;
			
			//bd
			self.elemBody = doc.createElement('bd');
            self.elemBody.className = cfg.classNameBd;
            self.setBody( cfg.body );

			// 注册关闭按钮
			if(true === cfg.close) {
                //ft
                self.elemFoot = doc.createElement('ft');
                self.elemFoot.className = cfg.classNameFt;
                self.elemFoot.innerHTML = cfg.foot;
                Event.on(DOM.query('a.close', self.elemFoot), 'click', function(evt) {
					evt.preventDefault();
					self.hide();
				});
			}
		    
            //append
			self.elem.appendChild(self.elemHead);
            self.elem.appendChild(self.elemBody);
            self.elem.appendChild(self.elemFoot);
			doc.body.appendChild(self.elem);
			
			// 初始化遮罩层
			if(true === cfg.mask) {
				self.mask = doc.createElement('mask');
				self.mask.id = self.elem.id + '_' + cfg.maskClassName;
				self.mask.className = cfg.maskClassName;
                DOM.css(self.mask, 'height', DOM.docHeight() + 'px');
                DOM.css(self.mask, 'visibility', 'hidden');
				DOM.css(self.mask, 'z-index', self.config.zIndex - 1);
				doc.body.appendChild(self.mask);
			}
			
			// 初始化拖拽
			if(true === cfg.drag) {
				
				DOM.addClass(self.elem, 'ui-dialog-dd');
				S.use('dd',function(){
					var node = S.one('#'+self.elem.id);
				    new S.Draggable({
						node:node,
					    handlers:[S.one('.'+cfg.classNameHd)],
					    shim:true				
				    }).on("drag", function(ev) {
                    	if (ev.left < 0||ev.top<0) return;
                    	this.get("node").offset(ev);
                        });
					});
			   }
		}
	});

   H.widget.Dialog = Dialog;
    
   H.widget.DialogMgr = {
        /* 存储已初始化的dialog */
        list: {},
        /**
            * 返回H.widget.Dialog对象
            */
        get: function(id, config) {
            if(!id || !this.list[id]) {
                var D = new H.widget.Dialog(config);
                id = !id ? D.elem.id : id;
                this.list[id] = D;
            }
            return this.list[id];
        }
    };
});
/* vim: set et sw=4H=4 sHLG=4 fdm=indent ff=unix fenc=gbk: */
/**
 *H.Msg 简易消息提示
 *
 *   new msg = H.util.Msg();  
 * 方法：setHeader(str);  设置头部
 		 setMsg(value); 设置消息 
         show(): 居中显示遮罩， 
 * 		 show(id)  特定容器里 显示消息  
 *		 showDialog() 简易对话
 * 
 * 					
 */
 H.add('widget~msg', function( HLG ) {
    var S = KISSY, DOM = S.DOM, Event = S.Event,doc = document,
		HIDDEN = 'hidden'; num = 0;
	
	function Msg() {
		var self = this; 
        if (!(self instanceof Msg)) { 
            return new Msg(); 
        }
        this.mask1 = null,
        this.elem = null;
        this.panel =null;
        this.msg = null;
        this.header = "错误提示";
        this.message = null;
	}

	S.mix(Msg.prototype, {
		
		/*
		 * 
		 * 设置消息
		 *
		 * @param value {String} 消息内容
         * show(mode) 
		 *			   
		 * */
		setHeader: function(str){
			 var self =this;
			 if(S.isString( str )){
				 self.header =str;
			 }
			 return this;
		 },
		 
		setMsg: function(value){
			 var self = this;
			 if(value ==undefined){
				 self.msg = null;
			 }else{
				 self.msg = value;
			 }
			 return this;
		 }, 
		 
		setBody: function( value ,mode) {
			 var self = this;
			 if(mode==1){
				 if ( S.isString( value ) ) {
					 this.elem.innerHTML = value;
				 } 
			 }else if(mode==2){
				 if ( S.isString( value ) ) {
					 this.message.innerHTML = value;
				 } 
			 }else {
				 self.panel.setBody(value);
			 }
			return this;
        },
        
        createDiv: function(){
	        	var parent = DOM.create('<div class="messages-prompt"><div class="fbloader"><img  src=" http://img.huanleguang.com/hlg//fbloader.gif" width="16" height="11" /></div></div>');
	        	this.elem = doc.createElement('div'); 
	        	DOM.append(this.elem,parent);
				doc.body.appendChild(parent);
        },
        
        createDialog: function(){
        	var Id = 'msg_panel'+num++;
			this.panel = H.widget.DialogMgr.get(Id,{
				 ID: Id,
				 head: '错误提示',
				 body: '',
				 foot: '<a href="javascript:;" class="close">close</a>',
				 center: true,
				 width: '400px',
				 keypress: true,
				 mask: true,
				 drag: true	
			});
        },
        
        /**
		 * 居中 
		 */
		center: function() { 
			var self = this, x, y;
			var elem = DOM.parent(this.elem),
				elemWidth = elem.offsetWidth,
				elemHeight = elem.offsetHeight;
			viewPortWidth = DOM.viewportWidth(),
			viewPortHeight = DOM.viewportHeight();
            if (elemWidth < viewPortWidth) {
                x = (viewPortWidth / 2) - (elemWidth / 2) + DOM.scrollLeft();
            } else {
                x = DOM.scrollLeft();
            }

            if (elemHeight < viewPortHeight) {
                y = (viewPortHeight / 2) - (elemHeight / 2) + DOM.scrollTop();
            } else {
                y = DOM.scrollTop();
			}
            DOM.css(elem, { left: x, top: y });
            return self;
		},
		
		show: function( id ) {
			var self = this;
            //DOM.removeClass( elem, 'error' );
            //DOM.removeClass( elem, HIDDEN );
			value = self.msg;
            if(id == undefined){
	            	if(!this.elem){
	            		self.createDiv();
	            	}
	            	DOM.css(DOM.parent(self.elem),'opacity','1');
	            	self.setBody(value,1);
	            	self.mask();
	            	DOM.show(DOM.parent(self.elem));
	            	self.center();
	            	function  msgRoll(){
	            		self.center();
	            	}
	            	window.onscroll = msgRoll;
            }else {
            	this.message = DOM.get(id);
            	self.setBody(value,2);
            	DOM.show(this.message);
            }
            //DOM.css( self.elem, 'opacity', 1);
			//return type + '' - 0 === 0 ? DOM.addClass( elem, 'error' ) : '';
		},
		/*一般错误消息提示 body 样式
		 * <div class="point relative"><div class="point-w-1">团购初始参团人数必须大于等于0</div></div>
		 * */
		showDialog: function(){
			var self = this;
			if(!this.panel){
				self.createDialog();
			}
			self.panel.setHeader(self.header);
			self.setBody(self.msg);
			self.panel.show();
			
		},
		
	   // 初始化遮罩层
		mask: function() {
			var self = this;
				mask = doc.createElement('mask');
				self.mask1 = mask;
				mask.id = 'messageMask';
				DOM.css(mask, 'height', DOM.docHeight() + 'px');
	            DOM.css(mask, 'opacity', '0.1');
				DOM.css(mask, 'background-color','#000000');
				DOM.css(mask, 'height', DOM.docHeight() + 'px');
				DOM.css(mask, {position: 'absolute', top:'0px', left:'0px',right:'0px',bottom:'0px'});
	            DOM.css(mask, 'width','100%');
		        DOM.css(mask, 'filter','alpha(opacity=10)');
				DOM.css(mask, 'z-index', 1000003);
				doc.body.appendChild(mask);
				if(KISSY.UA.ie == 6){
		        	DOM.append(DOM.create('<iframe style="position:absolute; top:0px; left:0px; width:100%; height:100%; opacity:0; filter:alpha(opacity=0);z-index:-1; scrolling:no; visibility:inherit" frameborder="5" src=""></iframe>'),DOM.get('#messageMask'));
		        }
			return this;
		},
		/*
		 * 隐藏
		 *
		 * @param b {Boolean} 是否延时隐藏, 默认false
		 * */
		hide: function( b ) {
			var self = this;
			if(self.elem){
	            if ( true === b ) {
	                // 已延迟了, 重新开始
	                if ( self.timer ) {
	                    self.timer.cancel();
	                }
			        self.timer = S.later(function() {
						var p = { opacity:0 },a = S.Anim( DOM.parent(self.elem), p, 0.3 );
						DOM.hide(self.message);
						DOM.remove(self.mask1);
	                    DOM.hide(DOM.parent(self.elem));
						DOM.remove(self.mask1);
	                    self.timer = null;	
						a.run();
	                }, 2000);
				}else{
					DOM.hide(self.message);
					DOM.remove(self.mask1);
					DOM.hide(DOM.parent(self.elem));
					DOM.remove(self.mask1);
				}
			}
			if(self.panel!=null){
				self.panel.hide();	
			}
		}
	});

	 H.util.Msg = Msg;
});

H.add('widget~asyncRequest', function(HLG) {
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;
	
	function asyncRequest(uri) {

    	var self = this; 
        if (!(self instanceof asyncRequest)) { 
            return new asyncRequest(uri); 
        }
		this.form = ''; 
        this.dataType = 'json';
	    this.uri = '';
        this.method = 'GET';
        this.data = null;
        this.bootloadable = true;
        this.resList = [];
        if (uri != undefined) {
            this.setURI(uri);
        }
      
    };
	
	S.mix(asyncRequest.prototype,{
		
		handleSuccess: function() {
			return undefined;
		},

        handleFailure: function(o) {
           alert(o.desc);
        },
		
        mapRes: function() {
            var links = document.getElemenHLGByTagName("link");
            var scripHLG = document.getElemenHLGByTagName("script");
            if (links.length) {
                for (var i = 0, l = links.length; i < l; i++) {
                    this.resList.push(links[i].href);
                }
            }
            if (scripHLG.length) {
                for (var i = 0, l = scripHLG.length; i < l; i++) {
                    this.resList.push(scripHLG[i].src);
                }
            }
        },
		
		setMethod: function(m) {
            this.method = m.toString().toUpperCase();
            return this;
        },
		
        getMethod: function() {
            return this.method;
        },
		
        setData: function(obj) {
        	this.data = obj;
            return this;
        },
		
        getData: function() {
            return this.data;
        },
		 setForm: function(form) {
        	this.form = form;
            return this;
        },
		
        getForm: function() {
            return this.form;
        },
        setURI: function(uri) {
            this.uri = uri;
            return this;
        },
		
        getURI: function() {
            return this.uri.toString();
        },
        
        setDataType: function(datatype) {
            this.dataType = datatype;
            return this;
        },
		
        getDataType: function() {
            return this.dataType;
        },
		
        setHandle: function(fn) {
        	this.handleSuccess = fn;
            return this;
        },
		
        setErrorHandle: function(fn) {
        	this.handleFailure = fn;
            return this;
        },
        dispatchResponse: function(o,b) {

        	b.handleSuccess(o);
            var onload = o.onload;
            if (onload) {
                try { (new Function(onload))();
              
			    } catch(exception) {
                   // HLG.widget.msgBox.setMsg('执行返回数据中的脚本出错').setAutohide().show()
                }
            }
        },
        disableBootload: function() {
            this.bootloadable = false;
            return this;
        },
        enableBootload: function() {
            this.bootloadable = true;
            return this;
        },
        
        dispatchErrorResponse: function(o) {
        	new H.util.Msg().setMsg('与服务器交互出错，请检查网络是否连接正常').show();
        	S.later(function(){window.history.back(-1);},10000,false,null,null);
        	//S.later(function(){window.history.back(-1);},3000,false,null,null);
        },
        send: function() {
        	var self = this;
            if (self.method == "GET" && self.data) {
                self.uri += ((self.uri.indexOf('?') == -1) ? '?': '&') + self.data;
                self.data = null;
            }
        	var ajax = this;
        	
        	interpretResponse = function(data, textStatus, xhr,ajax) {
        		var self = ajax;
        		if (data.ajaxExpired!=null) {
        			window.location = data.ajaxRedirect;
        			return
        		}
        		if (data.error) {
        			//alert(this.handleFailure);
        			var fn = self.handleFailure;
        		} else {
        			var fn = self.dispatchResponse;
        		}   
        		fn = fn.shield(null, data,ajax);
        		fn = fn.defer.bind(fn);
				/*
	            if (this.bootloadable) {
	                var bootload = data.bootload;
	                if (bootload) {
	                    Bootloader.loadResources(response.bootload, fn, false)
	                } else {
	                    fn()
	                }
	            } else {
	                fn()
	            }
				*/
				fn();
        	};
            S.ajax({
				form:self.form,
				type:self.method,
			    url:self.uri,
			    data:self.data,
		        success:function(data, textStatus, xhr){
            		interpretResponse(data, textStatus, xhr,ajax);
            	},
				error:this.dispatchErrorResponse,
			    dataType:self.dataType
				
			});
			
        }
	});
	H.widget.asyncRequest = asyncRequest;
});

  //分页 组件
H.add('widget~showPages', function( HLG ) { 
  
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;
  
	function showPages(name) { //初始化属性 
		var self = this; 
        if (!(self instanceof showPages)) { 
        	return new showPages(name); 
        } 	
		this.pageNum = 4 ;   
		this.name = name;      //对象名称
        this.page = 1;         //当前页数
        this.pageCount = 200;    //总页数
        this.argName = 'page'; //参数名	
		
  	}

	S.mix(showPages.prototype,{
		jump: function() {
	        return undefined;
	  	},
		
	    //进行当前页数和总页数的验证
        checkPages: function() { 
	     	if (isNaN(parseInt(this.page))) this.page = 1;
		 	if (isNaN(parseInt(this.pageCount))) this.pageCount = 1;
		 	if (this.page < 1) this.page = 1;
		 	if (this.pageCount < 1) this.pageCount = 1;
		 	if (this.page > this.pageCount) this.page = this.pageCount;
		 	this.page = parseInt(this.page);
		 	this.pageCount = parseInt(this.pageCount);
     	},
		
		//生成html代码	  
     	_createHtml: function(mode) { 
	   
         	var self = this, strHtml = '', prevPage = this.page - 1, nextPage = this.page + 1;   
            if (mode == '' || typeof(mode) == 'undefined') mode = 1;
		
            switch (mode) {
				case 1: 
					//模式1 (页数)
                    /* strHtml += '<span class="count">Pages: ' + this.page + ' / ' + this.pageCount + '</span>';*/
                    strHtml += '<span class="number">';
                    if (this.page != 1) {
						strHtml += '<span title="Page 1"><a href="javascript:' + self.name  + '.toPage(1);">1</a></span>';
				    }
                    if (this.page >= 5) {
				   		strHtml += '<span>...</span>';
				    }
				    if (this.pageCount > this.page + 2) {
                   		var endPage = this.page + 2;
                    } else {
                        var endPage = this.pageCount; 
                      }
                    for (var i = this.page - 2; i <= endPage; i++) {
					if (i > 0) {
						if (i == this.page) {
							strHtml += '<span title="Page ' + i + '">' + i + '</span>';
						} else {
							if (i != 1 && i != this.pageCount) {
								strHtml += '<span title="Page ' + i + '"><a href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a></span>';
							}
				          }
                    }
                    }
                    if (this.page + 3 < this.pageCount) {
						strHtml += '<span>...</span>';
					}
                    if (this.page != this.pageCount) {
						strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
					}
					strHtml += '</span><br />';
                    break;
								 
				case 2: 
					//模式2 (前后缩略,页数,首页,前页,后页,尾页)
					
					if(this.pageCount > 1){
	                    strHtml += '<div class="page-bottom"> <div class="sabrosus">';
	                    if (prevPage < 1) {
	                        strHtml += '<span class="pre-none page-pic-no"></span>';
	                    } else {
	                        strHtml += '<a class="" href="javascript:' + self.name + '.toPage(' + prevPage + ');" title="上一页"><span class="pre page-pic-no"></span></a>';
	                      }
	                    if (this.page != 1) {
							//strHtml += ' <a class="a-padding" href="javascript:' + self.name  + '.toPage(1);">1</a>';
						}
						if(this.page - 2<=0){
							var start = 1;
								if (this.pageCount > this.page + 4) {
	                           		var endPage = this.page + 4;
	                           } else {
	                             	var endPage = this.pageCount; 
	                            }
						}else if(this.page + 2>=this.pageCount){
							var start = this.pageCount-4;
							if (this.pageCount > this.page + 4) {
	                       		var endPage = this.page + 4;
	                        } else {
	                         	var endPage = this.pageCount; 
	                        }
						}else {
							var start = this.page - 2;
							if (this.pageCount > this.page + 2) {
		                           		var endPage = this.page + 2;
		                           } else {
		                             	var endPage = this.pageCount; 
		                             }
						}
	                    for (var i = start; i <= endPage; i++) {
	                    if (i > 0) {
	                       	if (i == this.page) {
	                           	strHtml += '<span class="current a-padding">'+ i + '</span>';
	                        } else {
	                           // if (i != 1 && i != this.pageCount) {
	                              	strHtml += '<a class="a-padding" href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a>';
	                           // }
						      }
	                    }
	                    }
	                    if (this.page + 5 < this.pageCount) {
							strHtml += '<a class="a-padding" title="" href="javascript:' + self.name + '.toPage(' + (this.page + 3) + ');">...</a>';
						}
				  	    if (this.page != this.pageCount) {
							//strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
						}
						if (nextPage > this.pageCount) {
	                    	strHtml += '<span class="next-none page-pic-no"></span>';
	                    } else {
	                        strHtml += '<a class="" href="javascript:' + self.name + '.toPage(' + nextPage + ');" title="下一页"><span class="next page-pic-no"></span></a>';
	                      }
						 if (this.pageCount > 5) {
			   					strHtml += '<font class="number">';
			   					strHtml += '共'+this.pageCount+'页&nbsp;到第&nbsp;';
			   					if(this.page>=this.pageCount){
			   						strHtml += '<input style="" type="text" class="page-pic-no w-30 bg-img" id="pageInput' + self.name + '"  value="' + this.pageCount + '" onkeypress="return ' + self.name + '.formatInputPage(event);" onfocus="this.select()">&nbsp;页';
			   					}else{
			   						strHtml += '<input style="" type="text" class="page-pic-no w-30 bg-img" id="pageInput' + self.name + '"  value="' + (this.page+1) + '" onkeypress="return ' + self.name + '.formatInputPage(event);" onfocus="this.select()">&nbsp;页';
			   					}
			   					strHtml += '<input type="button" value="" class="page-pic-no gray-btm-h-go w-30 btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;} ; ' + self.name + '.toPage(turnTo);">';
			   					strHtml += '</font>';	
			   					}
	                   strHtml += '<div style="clear:both"></div></div></div> ';
					}
                   break;
			   case 3 :
				   strHtml += '<div class="page-top"><div class="sabrosus"><span class="count">' + this.page + ' / ' + this.pageCount + '</span>';
                   if (prevPage < 1) {
                       strHtml += ' <span class="pre-none page-pic-no"></span>';
                   } else {
                       strHtml += '<a class="border-left-dedede" href="javascript:' + self.name + '.toPage(' + prevPage + ');" title="上一页"><span class="pre page-pic-no"></span></a>';
                     }
                   if (nextPage > this.pageCount) {
                   	strHtml += '<span class="next-none page-pic-no"></span>';
                   } else {
                       strHtml += '<a href="javascript:' + self.name + '.toPage(' + nextPage + ');" title="下一页"><span class="next page-pic-no"></span></a>';
                     }
                  strHtml += '<div style="clear:both"></div></div></div>';
                  break;
					
			}
		    return strHtml;
			   
		},
		 //限定输入页数格式
		formatInputPage : function(e){
			var ie = navigator.appName=="Microsoft Internet Explorer"?true:false;
			if(!ie) var key = e.which;
			else var key = event.keyCode;
			if (key == 8 || key == 46 || (key >= 48 && key <= 57)) return true;
			return false;
		},
      
	    //页面跳转 返回将跳转的页数
		toPage: function( page ,flag) { 
        	var turnTo = 1;
			var self = this;    
            if (typeof(page) == 'object') {
            	turnTo = page.options[page.selectedIndex].value;
            } else {
               	turnTo = page;
              }
			
            self.jump(turnTo,flag,'');
			  
		},
			  
        //显示html代码
	    printHtml: function(contian, mode) {  
			this.checkPages();
            DOM.html(contian,this._createHtml(mode));
			return this;
		},
				   
	    //设置总页数			  
	    setPageCount: function( pagecount ) {
			this.pageCount=pagecount;
	 	    return this;
		},			    
	    
		getPageCount: function() {
            return this.pageCount;
	    },
	    
		//设置跳转 执行函数
        setRender: function(fn) {
			this.jump = fn;
			return this;
		},	
     	setPageNum:function(page_num){
	        this.pageNum = page_num;
		    return this;
		 },
		setPage:function(page){
		    this.page = page;  
		    return this; 
	    }   	   

		  	   
	});

	H.widget.showPages = showPages;
});

 //循环倒计时
H.add('widget~countdown', function( HLG ) { 
  
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;

	function countdown(contain, endTime, mode) { //初始化属性 
		var self = this; 
        if (!(self instanceof countdown)) { 
        	return new countdown(contain, endTime, mode); 
        } 
        this.timer = null;
        self.init(contain, endTime, mode);	    
    }
	
	S.mix(countdown.prototype,{
		init: function(contain, endTime, mode) {
 	    	//var n = endTime || 1440; //剩余分钟数
 	    		var self = this;
			if (mode == '' || typeof(mode) == 'undefined') mode = 1;
			if(mode == 1){
				// 天 时 分 秒分 
				DOM.html(DOM.get(contain),' <span class="day"></span>天<span class="hour"></span>时<span class="min"></span>分<span class="sec"></span>秒 ');
			} 
			if(mode == 2){
				//  时 分 秒分 
				DOM.html(DOM.get(contain),' <span class="hour">19</span>时<span class="min">19</span>分<span class="sec">26</span>秒');
			} 
			if(mode == 3){
				//  时 分 秒分 
				DOM.html(DOM.get(contain),'<span class="hour"><b>0</b><b>0</b></span><span class="min"><b>0</b><b>0</b></span><span class="sec"><b>0</b><b>0</b></span>');
			} 
					   
            var fresh = function(data) {
            	var nowtime = new Date(), endtime = data;
				var leftsecond = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
                d = parseInt((leftsecond / 86400) % 10000);
                h = parseInt((leftsecond / 3600) % 24);
                m = parseInt((leftsecond / 60) % 60);
                s = parseInt(leftsecond % 60);
				if (mode == 3) {
					var h = h + d * 24;
				}	
				if(d>=0 && d<10){
					d= '0'+d;
				}
				if(h>=0 && h<10){
					h = '0'+h;
				}
				if(m>=0 && m<10){
					m = '0'+m;
				}
				if(s>=0 && s<10){
					s = '0'+s;
				}
                if( mode == 1 ){
					DOM.html(DOM.get(contain+' .day'), d);
                	DOM.html(DOM.get(contain+' .hour'), h);
                	DOM.html(DOM.get(contain+' .min'), m);
                	DOM.html(DOM.get(contain+' .sec'), s);
				}
				if( mode == 2 || mode == 3){
					if(mode == 3){
						var h = h.toString();
						var m = m.toString();
						var s = s.toString();
							h = '<b>'+h.charAt(0)+'</b><b>'+h.charAt(1)+'</b>';
							m = '<b>'+m.charAt(0)+'</b><b>'+m.charAt(1)+'</b>';
							s = '<b>'+s.charAt(0)+'</b><b>'+s.charAt(1)+'</b>';
					}
                	DOM.html(DOM.get(contain+' .hour'), h);
                	DOM.html(DOM.get(contain+' .min'), m);
                	DOM.html(DOM.get(contain+' .sec'), s);
				}
				if(leftsecond<=0){
					self.endDo();	
				}
            };
            //S.later(newendtime, n * 60000/*1s*/, true/*setInterval*/, null/*context*/, null);
            if(self.timer){
				self.timer.cancel();
			}
            self.timer = S.later(fresh, 1000 /*1s*/, true/*setInterval*/, null/*context*/, endTime);
		},
		//设置结束时 执行函数
        setRender: function(fn) {
			var self = this;
			this.endDo = fn;
			return this;
		},	
		endDo : function(){
			var self = this;
			self.timer.cancel();	
		}
	
				  	   
	});

	H.widget.countdown = countdown;
});


//上下左右无缝滚动
H.add('widget~roll', function( HLG ) { 
  
	/*结构
	<div id="demo">
		<div id="demo1">
 			<div></div>
  			<div></div>
		</div>
		<div id="demo2"></div>
	</div>
	*/	
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;
		
	var LEFT = "left", RIGHT = "right", UP = "up", DOWN = "down";
	
	function roll(contain, mode,speed) { //初始化属性 
		var self = this;
		if (!(self instanceof roll)) { 
        	return new roll(contain, mode, speed); 
        } 
	   
	    this.tab = DOM.get(contain);
		this.speed = speed;
		var child = DOM.children(this.tab);
	    if(child.length!=2) return;
	    this.tab1 = child[0];
		this.tab2 = child[1];
	   self.init(mode);	 
    }
	
	S.mix(roll.prototype,{
		init: function(mode) {
			
 	    	var self = this;   
            if (mode == '' || typeof(mode) == 'undefined') mode = UP;
			switch(mode){
				case UP:
					DOM.html(self.tab2,DOM.html(self.tab1));
					
					function MarqueeUp(){
						if(self.tab2.offsetTop-self.tab.scrollTop<=0)
							self.tab.scrollTop-=self.tab1.offsetHeight;
						else{
							self.tab.scrollTop++;
						}
					}
					self.timer = S.later(MarqueeUp,self.speed,true,null,null);
					Event.on(self.tab,'mouseenter mouseleave',function(ev){
						if(ev.type == 'mouseenter'){
							self.timer.cancel();
						} else {
						    self.timer = S.later(MarqueeUp,self.speed,true,null,null);
						}
						
					});
					break;
					
				case DOWN: 
					DOM.html(self.tab2,DOM.html(self.tab1));
					self.tab.scrollTop=self.tab.scrollHeight;
					function MarqueeDown(){
						if(self.tab1.offsetTop-self.tab.scrollTop>=0)//当滚动至demo1与demo2交界时
							self.tab.scrollTop+=self.tab2.offsetHeight;//demo跳到最顶端
						else{
							self.tab.scrollTop--;
						}
					}
					self.timer = S.later(MarqueeDown,self.speed,true,null,null);
					Event.on(self.tab,'mouseenter mouseleave',function(ev){
						if(ev.type == 'mouseenter'){
							self.timer.cancel();
						} else {
						    self.timer = S.later(MarqueeDown,self.speed,true,null,null);
						}
						
					});
					break;
					
				case LEFT: 
					alert('left');
					break;
				case RIGHT: 
					alert('right');
					break;			
			}
		}
	});

	H.widget.roll = roll;
});

