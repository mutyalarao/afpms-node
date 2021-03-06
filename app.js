
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , async = require('async')
,fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var bodyParser = require('body-parser');
var handler = require('./lib/handler.js');
var multer = require('multer');
var url=require('url');
var uploadDone=false;
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html',  require('ejs').__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());  
app.use(multer({ dest: './uploads/'
	,
	 rename: function (fieldname, filename) {
	    return filename+Date.now();
	  },
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  uploadDone=true;
	}
	}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/users', user.list);

app.get('/',function(req,res,next){
	console.log('In Home');
	res.render('index',{title:"Test"});
});	
app.get('/addVet',function(req,res,next){
	res.render('addVet');
});	
app.get('/searchVet',function(req,res,next){
	console.log('In searchvet');
	res.render('searchVet');
});
app.get('/circular',function(req,res,next){
	console.log('In circular');
	res.render('circular');
});	
app.get('/setupRef',function(req,res,next){	
	res.render('setupRef');
});
app.get('/circular',function(req,res,next){	
	res.render('circular');
});	
app.post('/api/AddVet',function(req,res,next){
	handler.addNewVeteran(req,res,function(err,data){
		
		if(err!=null){	
			console.log('insert failed'+err);
			res.status(200).type('json');
			res.end(JSON.stringify(err,{"rows":0,"err":err}));
		}
		else{
			console.log('insert success');
			res.status(200).type('json');
			res.send(JSON.stringify(null,{"rows":data.affectedRows}));
		}
		
	});
});	
app.post('/api/GetVet',function(req,res,next){
	//console.log(JSON.stringify(req.item));
	console.log(req.body.vetId);
	//console.log("retdata=" + retData); 
	handler.getVetInfo(req,res,function(err,data){
		
		if(data!=null){
		console.log("back to post:"+data[0].service_num);
		res.status(200).type('json');		
		res.end(JSON.stringify(data));
		//res.render('searchVet.html',{layout:false, data:data});
		}
		else{
			res.status(200).type('json');		
			res.end("");
		}
	});
});
app.get('/api/getFile',function(req,res){
	if(req.query.item=='vetDetails')
	{
		var filePath=__dirname + "/docs/vet_details_template.csv";
		res.download(filePath);
	}
});
app.post('/api/upload',function(req,res){
	  console.log(req.files);
	  console.log(req.body.uploadItem);
	 
	  if(uploadDone==true){
		  
		  var output = [];
		  var parser = parse({delimiter: ':'})
		  if(req.body.uploadItem=='circular'){
			handler.deleteCircData(req,function(err){
				if(!err){ //no error, delete called success. now parse the csv
				    console.log('in circular If');
					handler.parseCSV(req,'./uploads/'+req.files.x.name,function(err,data){ 
					console.log('file reading...');
					res.status(200).type('json');		
					res.end(JSON.stringify({"ret":"success"}));}
			  );
			 }
		else{
			console.log(err.toString());
		}	
			})
		  }
		  else{
			  handler.parseCSV(req,'./uploads/'+req.files.x.name,function(err,data){ 
				console.log('file reading...');
				res.status(200).type('json');		
				res.end(JSON.stringify({"ret":"success"}));}
			  );
			 }
		  
	
	   
	  }

	});


app.post('/api/addRefData',function(req,res){
	handler.addRefData(req,res,function(err,data){
		if(err!=null){	
			console.log('insert failed'+err);
			res.status(200).type('json');
			res.end(JSON.stringify(err,{"rows":0,"err":err}));
		}
		else{
			console.log('insert success');
			res.status(200).type('json');
			res.send(JSON.stringify(null,{"rows":data.affectedRows}));
		}
		
	});
	
});

app.post('/api/updateRefData',function(req,res){
	handler.updateRefData(req,res,function(err,data){
		if(err!=null){	
			console.log('update failed'+err);
			res.status(200).type('json');
			res.end(JSON.stringify(err,{"rows":0,"err":err}));
		}
		else
		if(err==null){
			console.log('update success');
			res.status(200).type('json');
			res.send(JSON.stringify(null,{"rows":data.affectedRows}));
		}
		
	});
	
});

app.post('/api/deleteRefData',function(req,res){
	handler.deleteRefData(req,res,function(err,data){
		if(err!=null){	
			console.log('delete failed'+err);
			res.status(200).type('json');
			res.end(JSON.stringify(err,{"rows":0,"err":err}));
		}
		else
		if(err==null){
			console.log('delete success');
			res.status(200).type('json');
			res.send(JSON.stringify(null,{"rows":data.affectedRows}));
		}
		
	});
	
});

app.get('/api/getRefData',function(req,res){
			
	handler.getRefData(req,res,function(err,data){
		if(err!=null){	
			console.log('get failed'+err);			
		}
		else{
			console.log('get success');			
		}
		res.status(200).type('json');
		res.end(JSON.stringify({"err":err,"data":data}));
	});
	
});

app.post('/api/getCircData',function(req,res){
			
	handler.getCircData(req,res,function(err,data){
		if(err!=null){	
			console.log('get failed'+err);			
		}
		else{
			console.log('get success');			
		}
		res.status(200).type('json');
		res.end(JSON.stringify({"err":err,"data":data}));
	});
	
});

app.get('/api/getLookup',function(req,res){
	handler.getLookup(req,function(err,data){
		//if(!err) //success
		{
			res.status(200).type('json');
			res.end(JSON.stringify({"err":err,"data":data}));
		}
		
	});
});

app.post('/api/getVetInfo',function(req,res){
	handler.getVetInfo(req,res,function(err,data){
		//if(!err) //success
		{
			res.status(200).type('json');
			res.end(JSON.stringify({"err":err,"data":data}));
		}
		
	});
});

app.post('/api/searchVet',function(req,res){
			
	handler.searchVet(req,res,function(err,data){
		if(err!=null){	
			console.log('get failed'+err);			
		}
		else{
			console.log('get success');			
		}
		res.status(200).type('json');
		res.end(JSON.stringify({"err":err,"data":data}));
	});
	
});

app.post('/api/updateVet',function(req,res){
			
	handler.updateVet(req,res,function(err,data){
		if(err!=null){	
			console.log('update failed'+err);			
		}
		else{
			console.log('updateVet - update success');			
		}
		res.status(200).type('json');
		res.end(JSON.stringify({"err":err,"data":data}));
	});
	
});


app.listen(3000,function(req,res){console.log('sss');});
