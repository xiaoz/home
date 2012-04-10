(function() {
  // IE6 
  if (!+'\v1' && !('maxHeight' in document.body.style)) {
      window['FXL_IE6'] = 1;
      //if (window.location.hash !== '#ie6') return window.location.href = '/not-supported.html';
  } else {
      window['FXL_IE6'] = 0;
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

  var alias = {
  'base': 'base',
  
  };
 
  var map = [
    [/^(.*\/js\/.*?)([^\/]*\.js)$/i, '$1$2?t=20120314']
  ];

/*   
$1 ��ʾ base ·�� $2 ��ʾjs�ļ�
var map = [
    [/^(.*\/js\/.*?)([^\/]*\.js)$/i, '$1__build/$2?t=20120314']
  ];*/


  if (seajs.debug) {
    for (var k in alias) {
      if (alias.hasOwnProperty(k)) {
        var p = alias[k];
        if (!/\.(?:css|js)$/.test(p)) {
        alias[k] += '-debug';
        }
      }
    }
    map = [];
  }

  seajs.config({
    alias: alias,
 /*   preload: [
      Function.prototype.bind ? '' : 'es5-safe',
      this.JSON ? '' : 'json'
    ],*/
    map: map,
    base: '',
	preload: ['plugin-json','http://a.tbcdn.cn/s/kissy/1.2.0/??/switchable/switchable-pkg-min.js,uibase-min.js,overlay-min.js,dd-min.js,editor/editor-all-pkg-min.js,editor/biz/ext/editor-plugin-pkg-min.js,component-min.js,waterfall-min.js,calendar/calendar-pkg-min.js,template/template-pkg-min.js,resizable-min.js','/javascripts/main.js']
  });

})();


define(function(require, exports) {
  exports.load = function(filename) {
		modNames = filename.split(',')
		for(var i=0,len=modNames.length;i<len;i++){
			 require.async('./'+modNames[i], function(mod) {
			 	if (mod && mod.init) {
			  		mod.init();
			 	}
			 })
		}
  };
 /* require.async('./head');
  require.async('./ga');
  if (window['FXL_IE6'])  require.async('./ie6');
  */
});
