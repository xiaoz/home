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
app.get('/ajax', routes.ajax);

app.listen(config.port);
console.log("myApp listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("God bless love....");
