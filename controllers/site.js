
var config = require('../config').config;

exports.index = function(req,res,next){
		
		res.render('index');
	
};

exports.ajax = function(req,res,next){
	
	  var db_options = {
			    host: 'r6472binghua7.mysql.aliyun.com',
			    port: 3306,
			    user: 'r8822binghua7',
			    password: 'ra82dee7e',
			    database: 'r8822binghua7'
			};
//加载mysql Module  
var mysql = require('mysql'),client = null;
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
var page_id = req.query.page_id;
var page_size = req.query.page_size;
var start = (page_id - 1)*10
var str = 'Select * From user Where ID>=( Select ID From user limit '+start+',1)limit '+page_size;

client.query(
  str,
  function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }  
    //console.log(fields); 
    res.end(JSON.stringify(results));//普通的json
    client.end();
  }
);    
	  
	  
	
};