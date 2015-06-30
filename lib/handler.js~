var url = require("url")
var path = require("path");
var http = require("http");
var fs = require('fs');
var mime = require('mime');
var serveStatic = require('./static');
var cache={};


var vetData={
id:'1001'
,name:'rao'
};
var router={};
router.url="";
router.routes = [];      
    
    router.routes['/']=function (req,res){
        console.log("in / ....");
        filePath='./views/index.html';
        serveStatic.serveFile(res,cache,filePath);
    };

    router.routes['/data']=function(req,res){
        console.log("in /data ....");
          if(req.method == 'GET'){  
          res.writeHead(200, {'content-type': 'text/json' });
            res.write( JSON.stringify(vetData) );
            res.end('\n');
          }

    };
router.route=function(){
    var q=this.req;
    var s=this.res;
    this.routes[this.url](q,s);
}
    function home (req,res){
        console.log("in / ....");
        filePath='./views/index.html';
        serveStatic.serveFile(res,cache,filePath);
    };
   function dataX (req,res){
        console.log("in /data ....");
        if(req.method == 'GET'){  
          res.writeHead(200, {'content-type': 'text/json' });
            res.write( JSON.stringify(vetData) );
            res.end('\n');
        }
    };
function send404(req,res)
{
    console.log("inzzz 404 ....");
    if(req.method == 'GET'){  
          res.writeHead(404, {'content-type': 'text/plain' });            
            res.end('404: NOt found');
    }
}
function searchVet(req,res){
    console.log("in search vet....");
    if(req.method='GET'){
        filePath='./views/searchVet.html';
        serveStatic.serveFile(res,cache,filePath);
    }
}
function route(req,res)
{
	var url = req.url;
	
	if(url=='/') {home(req,res); return 1;}
	if(url == '/data'){searchVet(req,res); return 1;}
	if(url== '/searchVet.html'){dataX(req,res); return 1;}
   // send404(req,res);
   return -1;
	
}
exports.route = function(req,res){
    console.log(req.type);
    
    console.log(route(req,res));
};