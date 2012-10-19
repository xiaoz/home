/**
 * config
 */

exports.config = {
	name: 'car Club',
	description: '养生粥',
	host: 'http://127.0.0.1/',
	session_secret: 'car_club',
	auth_cookie_name: 'car_club',
	app_port: 10080,
	version: '0.0.1',
	
	//logfiles directory
	logDirectory : __dirname + "/logs/",

	// mysql config
	server : "r2602binghua7.mysql.aliyun.com",
	port : 3306,
	user : "r8549binghua7",
	password : "r6081760d",
	database : "r8549binghua7",
	maxSockets : 80,//pool使用
	timeout : 1,//pool使用
	
//	admins: {admin:true}
};

