var mime = require('mime');
var fs=require('fs');
var path=require('path');


	var serveStatic= function (response,cache,absPath)
{
		fs.exists(absPath, function(exists) {
		if (exists) {
			fs.readFile(absPath, function(err, data) {
		if (err) {
			send404(response);
		} else {			
			sendFile(response, absPath, data);
		}
		});
		} else {
			send404(response);
		}
	}); 
}

function send404(response) {
response.writeHead(404, {'Content-Type': 'text/plain'});
response.write('Error 404: resource not found.');
response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(	200,
	{"content-type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

exports.serveFile=serveStatic;
