
	var config = require('../config').config;
	var db_options = {
		    host: config.db_host,
		    port: config.db_port,
		    user: config.db_user,
		    password:  config.db_password,
		    database: config.db_database
		};
	var mysql = require('mysql');
	
	exports.index = function(req,res,next){
		
		res.render('index');
	
	};

	exports.ajax = function(req,res,next){
	 
		var client = null;
		if(mysql.createClient) {
		    client = mysql.createClient(db_options);
		} else {
		    client = new mysql.Client(db_options);
		    client.connect(function(err) {
		        if(err) {
		            console.error('connect db ' + client.host + ' error: ' + err);
		            process.exit();
		        }
		    });
		}
		var page_id  = Number(req.query.page_id) || 1;
		var page_size = Number(req.query.page_size) || 10;
		//var sort = req.query.sort || order by date desc,id desc;
		var start = (page_id - 1)*page_size;
		var str = 'Select * From user Where ID>=( Select ID From user limit '+start+',1)limit '+page_size;
		
		client.query(str,function selectCb(err, results, fields) {
			    if (err) {
			      throw err;
			    } 
			    var payload = {};
			    payload.collection = results;
			    payload.pageNum = page_size;
			    var str = 'Select count(*) as total From user' ;
				client.query(str,function selectCb(err, results, fields) {
					    if (err) {
					      throw err;
					    }  
					payload.totalRecords = results
				    res.end(JSON.stringify(payload));//普通的json
				    client.end();
				  }
				);    
		   
		  }
		);    
	};