$(document).ready(function(){
	$('#search_form').submit(function(e){
		e.preventDefault();
		search();	
	});
	
	function search(){
		var q = document.getElementById('q');
		if (q.value != '') {
			window.open('http://www.google.com/search?q=site:%20' + q.value, '_blank');
			return false;
		} else {
			return false;
		}		
	}	

	var $wrapper = $('#wrapper');
	var $backtotop = $('#backtotop');
	var top = $(window).height() - $backtotop.height() - 90;
	$backtotop.css({top:top,right:100});
	$backtotop.click(function(){
		$('html,body').animate({scrollTop:0});
		return false;
	});
	$(window).scroll(function() {
		var windowHeight = $(window).scrollTop();
		if(windowHeight > 200) {
			$backtotop.fadeIn();
		}else{
			$backtotop.fadeOut();
		}
	});

	$('.topic_content a,.reply_content a').attr('target','_blank');
});


define(function(require, exports, module) {
	  var S = KISSY,DOM = S.DOM, Event = S.Event;	doc = document;
	 
	  /* * 存放公用方法等* */
	  this.util = {
		    /*** 版本号*/
			version: '1.0',
			/*页面跳转*/
			setLocation: function(url)  {
				window.location.href = url;
				try {
					window.event.returnValue = false;
				} catch(e) {
					//
				}
			},
			/* * 页面刷新 * */
			pageReload: function( url ) {
				url = ( url || window.location.toString() ).replace(/t=(\d)+/g, '').replace(/([&|?])+$/, '');
				url = url + ( -1 === url.indexOf('?') ? '?' : '&' ) + 't=' + KISSY.now();
				return window.location = url;
			},
			/*链接跟踪
				@parame btn  跟踪链接点，
				@parame tag  跟踪标签名，
				@parame url  保存地址
			*/
			saveTrack: function(btn,tag,url){
					Event.on(btn,'click',function(){
						KISSY.io.get(url,{
					    	name:tag
						});
					})
			},
			/*切换小菊花*/
		 	toggleFlower: function(el) {
				DOM.toggleClass([el, DOM.prev(el)], 'hidden');
			},
			/**
	         * Print debug info.
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
			},
			/*复制功能*/
			clipboard: function(el,contain){
				Event.on(el,'click',function(ev){
					var copy = DOM.val(contain);
					if (window.clipboardData){
						 window.clipboardData.clearData();
						 window.clipboardData.setData("Text", copy);
						 var str = '已成功复制';
						 alert(str)
					}else if (window.netscape){
							 try{
									netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
								}catch(e){
									alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");
									return false;
								}
							//netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
							var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
							if (!clip) return;
							var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
							if (!trans) return;
							trans.addDataFlavor('text/unicode');
							var str = new Object();
							var len = new Object();
							var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
							var copytext=copy;
							str.data=copytext;
							trans.setTransferData("text/unicode",str,copytext.length*2);
							var clipid=Components.interfaces.nsIClipboard;
							if (!clip) return false;
							clip.setData(trans,null,clipid.kGlobalClipboard);
							 var str = '已成功复制';
							 alert(str)		
						}else if(KISSY.UA.core == 'webkit'){
							 var str = '该浏览器暂不支持，请用 Ctrl+c 复制';
							alert(str)
						}
					return false;
				})
			},
			//将日期 2011-6-27 10:22:30 格式 转为  Date 
			StringToDate: function(DateStr) {
				 if(typeof DateStr=="undefined")
					 return new Date();
				 if(typeof DateStr=="date")
					 return DateStr;
				 var converted = Date.parse(DateStr);
				 var myDate = new Date(converted);
				 if(isNaN(myDate)){
					 DateStr=DateStr.replace(/:/g,"-");
					 DateStr=DateStr.replace(" ","-");
					 DateStr=DateStr.replace(".","-");
					 var arys= DateStr.split('-');
					 switch(arys.length){
					 	case 7 : 
						 	myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5],arys[6]);
					        break;
					 	case 6 : 
						 	myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5]);
						 	break;
						default: 
							myDate = new Date(arys[0],--arys[1],arys[2]);
							break;
					};
				 };
				 return myDate;
			},
			/*格式化数字*/
			FormatNumber: function(srcStr,nAfterDot){
				var srcStr,nAfterDot;
				var resultStr,nTen;
				srcStr = ""+srcStr+"";
				strLen = srcStr.length;
				dotPos = srcStr.indexOf(".",0);
				if (dotPos == -1){
					resultStr = srcStr+".";
					for (i=0;i<nAfterDot;i++){
						resultStr = resultStr+"0";
				}
				return resultStr;
				}
				else{
				if ((strLen - dotPos - 1) >= nAfterDot){
				nAfter = dotPos + nAfterDot + 1;
				nTen =1;
				for(j=0;j<nAfterDot;j++){
				nTen = nTen*10;
				}
				resultStr = Math.ceil(parseFloat(srcStr)*nTen)/nTen;
				return resultStr;
				}
				else{
				resultStr = srcStr;
				for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
				resultStr = resultStr+"0";
				}
				return resultStr;
				}
				}
			},
			/*URL验证*/
			checkUrl : function(v){
				var result = [];
				var error = false;
				var msg = null;
				var reUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ ;
				if(!reUrl.test(v)){
						error = true;
						msg = '非法URl地址！';
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*折扣验证*/
			checkDiscount : function(v){
				var result = [];
				var error = false;
				var msg = null;
				if(isNaN(Number(v)) || v <= 0 || v >=10){
					error = true;
					msg = '折扣范围在 0.00~9.99之间哦！';
				}else {
					var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
					if(!re.test(v)){
						error = true;
						msg = '折扣范围在 0.00~9.99之间哦！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*价格判断*/
			checkPrice : function(v){
				var result = [];
				var error = false;
				var msg = null;
				if (isNaN(Number(v)) == true || v<=0) {
					error = true;
					msg = '价格是数字哦！';
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*是否为空*/
			isNull : function(str){
				var result = [];
				var error = false;
				var msg = null;
				if(str == null ||str == ""){
					error = true;
					msg = '请填写，此项不能为空！';
				}
				result.push(error);
				result.push(msg);
				return result;
				
			},
			/*验证活动名称*/
			checkPromoName : function(promoName){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]{2,5}$/;
				if(!re.test(promoName)){
					if(promoName.length<2 || promoName.length >5){
						error = true;
						msg = '长度2~5个字符！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]+/;
						var rt = promoName.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*违禁词限制*/
			checkSpecTitle : function(str){
				var result = [];
				var error = false;
				var msg = null;
				var re =/(淘宝)|(聚划算)|(限时折扣)|(良品)|(淘金币)|(天天特价)|(满就送)|(vip)/i;
				if(re.test(str)){
				    var rt = re.exec(str);
				    if(rt != null){
						error = true;
						msg = '含有违禁字'+rt[0]+'！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			}
			

	  };
									  /****************************************
										  ***								***
										  ***		常用 组件	：消息，异步，分页	***
										  ***		倒计时，上下滚动等			***
										  ***								***
										  ***************************************/
			/**
			 *Msg 简易消息提示
			 *  new msg = H.util.Msg();  
			 * 方法：setHeader(str);  设置头部
					 setMsg(value); 设置消息
					 setFooter(str);  设置尾部 
					 show(): 居中显示遮罩， 
			 * 		 show(id)  特定容器里 显示消息  
			 *		 showDialog() 简易对话					
			 */
		Msg = function() {
				var self = this; 
				if (!(self instanceof Msg)) { 
					return new Msg(); 
				}
				this.popup = null;
				this.dialog =null;
				this.msg = null;
				this.header = "错误提示";
				this.footer ='';
				this.el;
				this.status = 'msg'; 
			}
			S.mix(Msg.prototype, {
				/* 
				 * 设置消息
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
				 setFooter: function(str){
					 var self =this;
					 if(S.isString( str )){
						 self.footer =str;
					 }
					 return this;
				 },
				show :function(id){
					var self = this;
					if(id == undefined){
						var node = document.createElement("div");
							node.innerHTML = '<div class="messages-prompt"><div class="fbloader"><img  src=" http://img.huanleguang.com/hlg//fbloader.gif" width="16" height="11" /></div>'
											+'<div>'+self.msg +'</div>'
											+'</div>';
						if(!this.popup){
							this.popup = new KISSY.Popup({
								elStyle:{
									position:KISSY.UA.ie == 6 ? "absolute" : "fixed",
									background:"transparent"
								},
								align: {
									points: ['cc', 'cc']
								},
								effect: {
									effect:"fade",
									duration:0.5
								},
								mask: true
							});
							if (KISSY.UA.ie == 6) {
								Event.on(window, "scroll", function() {
									if (popup.get("visible"))
										popup.center();
								});
							}
						}					
						this.popup.set("content", node);
						this.status = 'msg'; 
						this.popup.show();
					}else{
						DOM.show(DOM.html(id,this.msg));
					}
				},
				showDialog: function(){
					var self = this;
					if(!this.dialog){
						this.dialog = new KISSY.Dialog({
							elCls:'ks-dialog',
							width: 400,
							bodyStyle:{
								
							},
							mask: true,
							align: {
								points: ['cc', 'cc']
							},
							draggable: true,    // 定义是否可拖拽
							closable:false,
							resize:{            // 可缩放大小, 并设置最小宽度/最小高度/缩放位置
								minWidth:150,
								minHeight:70,
								handlers:["b","t","r","l","tr","tl","br","bl"]
							}
						});
					}
					this.dialog.set("headerContent", self.header);
					this.dialog.set("bodyContent", self.msg);
					this.dialog.set("footerContent", self.footer);
					this.status = 'dialog'; 
					this.dialog.show();
				},
				hide: function(delay){
					var self = this;
					if(delay == undefined){
						delay = 0;
					}
					
					if(self.status == 'msg'){
						S.later(function(popup){popup.hide()},delay,false,null,this.popup);
						
					}else if(self.status == 'dialog'){
						S.later(function(dialog){dialog.hide()},delay,false,null,this.dialog)
					}else{
						S.later(function(popup,dialog){popup.hide();dialog.hide()},delay,false,null,[this.popup,this.dialog]);	
					}	
				}
		});
		 
			/**
			 *asyncRequest 异步
			 *  new asyncRequest = asyncRequest(url);  
			 * @param:	url地址
			 *	用法：new asyncRequest().setURI(url).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();	 			
			 */
		 asyncRequest = function(uri) {
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
	        	new Msg().setMsg('与服务器交互出错，请检查网络是否连接正常').show();
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
		/**
			 *showPages 分页
			 *  new showPages = showPages(name);  
			 * @param:	pageCount 总页数
			 * @param:	handlePagination 点击后执行的函数
			 * @param:	name 名称
			 * @param:	contain 显示容器
			 * @param:	mode 分页的模式 目前 有 3钟，可自定义加入 
			 *	用法：paginator = new showPages(name).setRender(handlePagination).setPageCount(pageCount).printHtml(contain,mode);
			 */
		showPages = function(name) { //初始化属性 
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
	                    // strHtml += '<span class="count">Pages: ' + this.page + ' / ' + this.pageCount + '</span>';
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
	                    // strHtml += '<span class="count">Pages: ' + this.page + ' / ' + this.pageCount + '</span>';
	                    strHtml += '<span class="number">';
	                    if (prevPage < 1) {
	                    	//strHtml += '<span title="First Page" class="number-none">第一页</span>';
	                        strHtml += '<span title="Prev Page"  class="number-none">上一页</span>';
	                    } else {
	                        //strHtml += '<span title="First Page"><a href="javascript:' + self.name + '.toPage(1);">第一页</a></span>';
	                        strHtml += '<span title="Prev Page"><a href="javascript:' + self.name + '.toPage(' + prevPage + ');">上一页</a></span>';
	                      }
	                    if (this.page != 1) {
							//strHtml += '<span title="Page 1"><a href="javascript:' + self.name  + '.toPage(1);">1</a></span>';
						}
						if (this.page >= 5) {
							//strHtml += '<span  class="number-none" >...</span>';
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
	                           	strHtml += '<span title="Page ' + i + '" class="current">' + i + '</span>';
	                        } else {
	                           // if (i != 1 && i != this.pageCount) {
	                              	strHtml += '<span title="Page ' + i + '"><a href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a></span>';
	                           // }
						      }
	                    }
	                    }
	                    if (this.page + 3 < this.pageCount) {
							strHtml += '<span  class="number-none">...</span>';
						}
				  	    if (this.page != this.pageCount) {
							//strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
						}
						if (nextPage > this.pageCount) {
	                    	strHtml += '<span title="Next Page"  class="number-none">下一页</span>';
	                        //strHtml += '<span title="Last Page"  class="number-none">最后一页</span>';
	                    } else {
	                        strHtml += '<span title="Next Page"><a href="javascript:' + self.name + '.toPage(' + nextPage + ');">下一页</a></span>';
	                        //strHtml += '<span title="Last Page"><a href="javascript:' + self.name +'.toPage(' + this.pageCount + ');">最后一页</a></span>';
	                      }
						 if (this.pageCount > 10) {
			   					strHtml += '<span class="margin-top-5">';
			   					strHtml += '共'+this.pageCount+'页&nbsp;到第';
			   					if(this.page>=this.pageCount){
			   						strHtml += '<input type="text" id="pageInput' + self.name + '" value="' + this.pageCount + '" class="input-text w-25" title="Input page" onkeypress="return ' + self.name + '.formatInputPage(event);" onfocus="this.select()">';
			   					}else{
			   						strHtml += '<input type="text" id="pageInput' + self.name + '" value="' + (this.page+1) + '" class="input-text w-25" title="Input page" onkeypress="return ' + self.name + '.formatInputPage(event);" onfocus="this.select()">';
			   					}
			   					strHtml += '页';
			   					strHtml += '<span class="gray-btm-60"><a style="border: 0px solid #CBCDCC;margin: 0px;padding: 0px" href="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;} ; ' + self.name + '.toPage(turnTo);"><span>GO</span></a></span>';
			   					strHtml += '</span>';	
			   					}
	                   strHtml += '</span>';
	                   break;
				   case 3 :
					   strHtml += '<span class="count">' + this.page + ' / ' + this.pageCount + '</span>';
	                   strHtml += '<span class="number">';
	                   if (prevPage < 1) {
	                       strHtml += '<span title="Prev Page" class="number-none">◄</span>';
	                   } else {
	                       strHtml += '<span title="Prev Page"><a href="javascript:' + self.name + '.toPage(' + prevPage + ');"><em style=" color:#FF6600">◄</em></a></span>';
	                     }
	                   if (nextPage > this.pageCount) {
	                   	strHtml += '<span title="Next Page" class="number-none">下一页</span>';
	                   } else {
	                       strHtml += '<span title="Next Page"><a href="javascript:' + self.name + '.toPage(' + nextPage + ');">下一页<em style=" color:#FF6600">►</em></a></span>';
	                     }
	                  strHtml += '</span><br />';
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
		/**
			 *countdown 倒计时
			 *  new countdown = countdown(contain, endTime, mode);  
			 * @param:	endTime 剩余时间
			 * @param:	contain 显示容器
			 * @param:	mode 倒计时的模式 目前 有 3钟，可自定义加入
			 * @method: setRender 倒计时结束 执行的函数 用于循环倒计时
			 *	用法：countdown = new countdown('#PromoCountDown',startTime,3);;
			 */
		countdown = function(contain, endTime, mode) { //初始化属性 
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
	            //S.later(newendtime, n * 60000, true, null, null);
	            if(self.timer){
					self.timer.cancel();
				}
	            self.timer = S.later(fresh, 1000 , true, null, endTime);
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
		
		/**
			 * roll 滚动
			 *  new roll = roll(ccontain, mode,speed);               结构 :	<div id="demo">
			 * @param:	mode 目前支持 向上 和向下     							  	<div id="demo1">
			 * @param:	contain 显示容器										    	<div></div>
			 * @param:	speed 滚动速度												<div></div>
			 * @method: 														</div>
			 *	用法：roll = new roll(contain, mode,speed) ;						<div id="demo2"></div></div>
			 */
		
		roll = function(contain, mode,speed) { 
			//初始化属性 
			var LEFT = "left", RIGHT = "right", UP = "up", DOWN = "down";
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
		
		  /* * 存放组件等* */
	  this.widget = {
		    /*** 版本号*/
			version: '1.0'
			
	  };    
	  return {
	    util: this.util	,
	    Msg: Msg,
		asyncRequest: asyncRequest,
		showPages: showPages,
		countdown: countdown,
		roll: roll
	  };
});