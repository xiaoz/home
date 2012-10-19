var express = require('express'),
	routes = require('./routes'),
	config = require('./config').config;

var app = express.createServer();

var static_dir = __dirname+'/public';

// configuration in all env
app.configure(function(){
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	app.register('.html',require('ejs'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret:config.session_secret,
	}));
	// custom middleware
	//app.use(routes.auth_user);
	app.use(express.csrf());
});

//set static,dynamic helpers
app.helpers({
	config:config
});
app.dynamicHelpers({
	csrf: function(req,res){
		return req.session ? req.session._csrf : '';
	},
});

app.configure('development', function(){
	app.use(express.static(static_dir));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	var one_year=1000*60*60*24*365;
	app.use(express.static(static_dir,{maxAge:one_year}));
	app.use(express.errorHandler()); 
	app.set('view cache',true);
});

// routes
app.get('/', routes.index);
//奥运徽标
app.get('/getCarAjax', routes.getCarAjax);
//爱情语录
app.get('/love', routes.love);

//日韩街拍
app.get('/photo', routes.photo);
//花样早餐
app.get('/breakfast', routes.breakfast);

//养生粥
app.get('/zhou', routes.zhou);
//人生一定去的山
app.get('/mustgo', routes.mustgo);
//排骨
app.get('/paigu', routes.paigu);
//甜品
app.get('/tianpin', routes.tianpin);
//车标大全
app.get('/all', routes.all);
app.get('/britain', routes.britain);
app.get('/italy', routes.italy);
app.get('/usa', routes.usa);
app.get('/germany', routes.germany);
app.get('/korea', routes.korea);
app.get('/france', routes.france);
app.get('/japan', routes.japan);
app.get('/china', routes.china);
app.get('/other', routes.other);

//交通标志大全
app.get('/all2', routes.all2);
app.get('/britain2', routes.britain2);
app.get('/italy2', routes.italy2);
app.get('/usa2', routes.usa2);
app.get('/germany2', routes.germany2);
app.get('/korea2', routes.korea2);
app.get('/france2', routes.france2);
app.get('/japan2', routes.japan2);
app.get('/china2', routes.china2);
app.get('/other2', routes.other2);

//语录
app.get('/yulu/:id', routes.yulu);


//从数据库获取数据
app.get('/getDataAjax', routes.getDataAjax);

app.get('/monitor', routes.monitor);

app.listen(config.app_port);
console.log("myApp listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("God bless love....");
