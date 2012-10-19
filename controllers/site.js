	var async = require('async');
	var config = require('../config').config;
	var mysql = require('../libs/mysql.js');
	
	//奥运徽标
	exports.index = function(req,res,next){
		res.render('index',{ active: '1' });
	};
	//爱情语录
	exports.love = function(req,res,next){
		res.render('love',{ active: '2' });
	};
	//日韩街拍
	exports.photo = function(req,res,next){
		res.render('photo',{ active: '3' });
	};
	
	//花样早餐
	exports.breakfast = function(req,res,next){
		res.render('breakfast',{ active: '4' });
	};
	
	//养生粥
	exports.zhou = function(req,res,next){
		res.render('zhou',{ active: '5' });
	};
	
	//人生一定去的山
	exports.mustgo = function(req,res,next){
		res.render('mustgo',{ active: '6' });
	};
	
	//排骨
	exports.paigu = function(req,res,next){
		res.render('paigu',{ active: '7' });
	};
		//甜品
	exports.tianpin = function(req,res,next){
		res.render('tianpin',{ active: '8' });
	};
	
	//车标大全
	exports.all = function(req,res,next){
		res.render('car/all',{ active: '9' });
	};
	exports.britain = function(req,res,next){
		res.render('car/britain',{ active: '9' });
	};
	exports.italy = function(req,res,next){
		res.render('car/italy',{ active: '9' });
	};
	exports.usa = function(req,res,next){
		res.render('car/usa',{ active: '9' });
	};
	exports.germany = function(req,res,next){
		res.render('car/germany',{ active: '9' });
	};
	exports.korea = function(req,res,next){
		res.render('car/korea',{ active: '9' });
	};
	exports.france = function(req,res,next){
		res.render('car/france',{ active: '9' });
	};
	exports.japan = function(req,res,next){
		res.render('car/japan',{ active: '9' });
	};
	exports.china = function(req,res,next){
		res.render('car/china',{ active: '9' });
	};
	exports.other = function(req,res,next){
		res.render('car/other',{ active: '9' });
	};
	
	//交通标志大全
	exports.all2 = function(req,res,next){
		res.render('jiaotong/all2',{ active: '10' });
	};
	exports.britain2 = function(req,res,next){
		res.render('jiaotong/britain2',{ active: '10' });
	};
	exports.italy2 = function(req,res,next){
		res.render('jiaotong/italy2',{ active: '10' });
	};
	exports.usa2 = function(req,res,next){
		res.render('jiaotong/usa2',{ active: '10' });
	};
	exports.germany2 = function(req,res,next){
		res.render('jiaotong/germany2',{ active: '10' });
	};
	exports.korea2 = function(req,res,next){
		res.render('jiaotong/korea2',{ active: '10' });
	};
	exports.france2 = function(req,res,next){
		res.render('jiaotong/france2',{ active: '10' });
	};
	exports.japan2 = function(req,res,next){
		res.render('jiaotong/japan2',{ active: '10' });
	};
	exports.china2 = function(req,res,next){
		res.render('jiaotong/china2',{ active: '10' });
	};
	exports.other2 = function(req,res,next){
		res.render('jiaotong/other2',{ active: '10' });
	};
	
	//语录
	exports.yulu = function(req,res,next){
		var type = req.params.id || 0
		res.render('yulu/index',{ active: '2' ,type:type});
	};
	
	exports.getCarAjax = function(req,res,next){
		var car_id  = Number(req.query.car_id) || 1;
		var contry = req.query.contry || all
		var data = require('../data/'+contry+'/main'+car_id+'.js')
        	res.end(JSON.stringify(data))
        	return;
	    
	};

	exports.getDataAjax = function(req,res,next){
		var page_id  = Number(req.query.page_id) || 1;
		var page_size = Number(req.query.page_size) || 6;
		var type = Number(req.query.type) || 0;
		//var sort = req.query.sort || order by date desc,id desc;
		var start = (page_id - 1)*page_size;
		async.auto({
	        signature : function(cb) {
	            mysql.query("Select * From user Where  type = ? ORDER BY  create_at DESC limit ? ,?", [ type,start,page_size], function(err, results) {
	                if (err) {
	                    cb(null, []);
	                }
	                if (!results) {
	                    cb(null, []);
	                }
	                if(results instanceof Array){
		                results.sort(function(a,b){
		                    if(a.email.length>b.email.length)return -1;
		                    	else if(a.email.length==b.email.length)return 0;
		                    	else return 1;
		                    	}
		                    );
		                if( typeof(results[2]) != 'undefined' && typeof(results[1]) != 'undefined'){
		                	var tem = results[2];
		                	results[2] = results[1];
		                	results[1] = tem;
		                }
	                }
	                cb(null, results);
	            });
	        },
	        totalRecords : function(cb) {
	            mysql.query("Select count(*) as total From user Where  type = ?", [type], function(err, results) {
	                if (err) {
	                    cb(null, []);
	                }
	                if (!results) {
	                    cb(null, []);
	                }
	                cb(null, results);
	            });
	        },
	      
	    }, function(err, results) {
	        if (err) {
	        	throw err;
	            return;
	        }
	        results.pageNum = page_size;
	        res.end(JSON.stringify(results))
	        return;
	    });
	};
	
	
	
	exports.monitor = function(req,res,next){
		res.render('monitor',{ layout: false });
	};