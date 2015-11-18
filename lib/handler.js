
var url = require("url")
var path = require("path");
var http = require("http");
var fs = require('fs');
var mime = require('mime');
var serveStatic = require('./static');
var mysql = require('mysql');
var utils = require('./utils');
var cache={};
var data;
var tblColMap;
//tbl
var lookupTblMap={
	"rank":["rank_code", "rank_descr", "vet_rank_ref"]
	,"branch":["branch_cd","descr","vet_branch_ref"]
	,"trade":["trace_cd","descr","vet_trade_ref"]	
    ,"decor":["decor_code","decor_name","vet_decor_ref"]	
    ,"phone":["phone_type","descr","phone_types"]    
	};
	
/*
To stack up ANY function calls till all are done

flow:
-push function refs in closure mode [ callback(err,data,parent) ]
 by calling push(<function ref>)
-call exec of the class providing a call back
 exec(<callback func>);

*/	
function asyncArr(){
	this.fList=[];
	this.dList=[];
	this.eList=[];
	this.retC=0;
	this.callback = null;
	this.mode="parallel";
}

asyncArr.prototype.pushF=function(func)
{
	this.fList.push(func);
}
asyncArr.prototype.pushD=function(data)
{
	this.dList.push(data);
}

asyncArr.prototype.exec=function(callback){
	for(var i=0;i<this.fList.length;i++)
	{
		var len = this.fList.length;
		this.fList[i](this.dList[i],function(err,data,parent){
			console.log("data:");
			console.log(data);
			parent.retC++;				
			console.log(parent.retC);
			if(parent.retC == len)			
			{
				console.log('inside exec');
				callback(err,data);
			} // parent callback - only when all done
		});
	}
}
/**********BEGIN********************
* Table Map declaration
* - holds the mapping between the 
* -json variables and database columns
*******************************/

function TblMap(name,dbTable){
 this.name=name;
  this.dbTable=dbTable;
  this.map={}; //holds the props, dCol, type
  this.whereArr=[];
  //this.arr=[];
}

TblMap.prototype.addMap=function(jCol,Obj){
 this.map[jCol]=Obj; 
}

TblMap.prototype.showMap=function(){
 // console.log(this.map.has);
  //console.log(this.map.getOwnPropertyNames);
 var arr=Object.getOwnPropertyNames(this.map)||['zz'];
 for(i=0,len=arr.length;i<len;i++)
 {
   console.log(arr[i]+","+this.map[arr[i]].dCol);
 }
}
TblMap.prototype.getQuotedCol=function(dCol){
    return "`"+dCol+"`";
}
TblMap.prototype.getInsert=function(dataObj){
    //loop through all the fields and add quotes according to the data type
    var sql="INSERT INTO "+this.dbTable;
    var dCol="";
    var qSep="",cSep=",";
    var valStr="",colStr="";
    console.log(dataObj);
	console.log("map");
	console.log(this.map);
    var objArr = Object.getOwnPropertyNames(dataObj);
    for(var i=0,len=objArr.length;i<len;i++){
        //use the jCol from dataObj and get the dCol
        var jCol = objArr[i]; 
       // console.log('jCol:'+jCol);
        if(dataObj[jCol])
        {
     // console.log(jCol);
        if(len-i==1) cSep=""
        else cSep=",";
		console.log("jCol:"+jCol);
        var dCol = this.getQuotedCol(this.map[jCol].dCol);
        
        if(this.map[jCol].type=='NUM' || this.map[jCol].type=='INT')        
            qSep="";
        else qSep="'";
        
        colStr+=dCol+cSep;
        valStr+=qSep+dataObj[jCol]+qSep+cSep;
        }
    }
    sql+="("+colStr+")";
    sql+=" values ("+valStr+")";
    //sql+=")";
    return sql;
}
/*
Purpose: to generate the UPDATE sql for a given table
Usage: table.getUpdate(setValObj,whereCritObj)
setValObj = {col1:"val1",col2:"val2",col3:"val3"}
whereObj =  {col1:"val1",col2:"val2",col3:"val3"}

Limits: Where obj is only for equals
*/
TblMap.prototype.getUpdate=function(valObj,whereObj)
{
  var sql="UPDATE " +this.dbTable+" SET ";
  var setStr = "",whereStr="";
    var objArr = Object.getOwnPropertyNames(valObj);
	this.whereObj=whereObj;
	//Loop through all values and create a SET string	
    for(var i=0,len=objArr.length;i<len;i++){
      var jCol = objArr[i]; 
      
      if(len-i==1) cSep=""
        else cSep=",";
      
      if(this.map[jCol].type=='NUM' || this.map[jCol].type=='INT')        
            qSep="";
        else qSep="'";
         
      setStr+=this.map[jCol].dCol+"="+qSep+valObj[jCol]+qSep+cSep;
    }
  
  // WHERE String
  
  	var objArr=Object.getOwnPropertyNames(this.whereObj);    
    //var objArr=utils.getPropList(this.whereObj);
    if(objArr.length>0) //where has criteria    
    {// construct the where string
		var whereStr=" WHERE ";
	    var whereValStr="";
	    for(var i=0, len=objArr.length;i<len;i++)
        { //objArr[i] -> i of map
   			var operator=" = ";
			var operand= this.whereObj[objArr[i]]; //where value
		if(operand){
	          if(i>0 && whereValStr) cSep=" AND ";
				if (this.map[objArr[i]].type=='DATE') operand="'"+this.whereObj[objArr[i]]+"'"; 
				if (this.map[objArr[i]].type=='CHAR') 
				{
				  operator=" LIKE "; 
				  operand="'%"+this.whereObj[objArr[i]]+"%'" ;
				}   
	   
	          whereValStr+=cSep + this.map[objArr[i]].dCol+operator + operand;
			}
        }
    	whereStr+=whereValStr;
    }
  return sql+setStr+" " +whereStr;
}


TblMap.prototype.wrapCol=function(jCol){
	if(this.map[jCol].type=='DATE')
		return " DATE_FORMAT("+this.map[jCol].dCol+",'%Y-%m-%d') ";
	else
		return this.map[jCol].dCol;
}

/*
Purpose: to GENERATE THE SELECT SQL FOR A GIVEN TABLE
Signature: table.getSelect(colArr)
Eg: 
Limits: Where clause is only AND
*/
TblMap.prototype.getSelect=function(colArr){
    var sql="SELECT ";
    var selStr="",cSep="";
    var objArr=Object.getOwnPropertyNames(this.map);
    if(colArr[0]=="*")
    {
      //console.log('in');  
      for(var i=0, len=objArr.length;i<len;i++)
        {
//console.log("len:"+len+"-i"+i);           
            if(len-i==1) cSep=""
            else cSep=",";
            selStr+=this.wrapCol(objArr[i])+" as " + objArr[i]+cSep;
        }
    }
    else
    {
        var objArr=colArr;
        for(var i=0,len=objArr.length;i<len;i++)
        {
            if(len-i==1) cSep=""
            else cSep=",";
            selStr+=this.wrapCol(objArr[i])+" as " + this.map[objArr[i]]+cSep;
        }
    }
    console.log(this.whereObj.sNum);
	
	var objArr=Object.getOwnPropertyNames(this.whereObj);    
    //var objArr=utils.getPropList(this.whereObj);
    if(objArr.length>0) //where has criteria    
    {// construct the where string
		var whereStr=" WHERE ";
	    var whereValStr="";
	    for(var i=0, len=objArr.length;i<len;i++)
        { //objArr[i] -> i of map
   			var operator=" = ";
			var operand= this.whereObj[objArr[i]]; //where value
		if(operand){
	          if(i>0 && whereValStr) cSep=" AND ";
				if (this.map[objArr[i]].type=='DATE') operand="'"+this.whereObj[objArr[i]]+"'"; 
				if (this.map[objArr[i]].type=='CHAR') 
				{
				  operator=" LIKE "; 
				  operand="'%"+this.whereObj[objArr[i]]+"%'" ;
				}   
	   
	          whereValStr+=cSep + this.map[objArr[i]].dCol+operator + operand;
			}
        }
    	whereStr+=whereValStr;
    }
    return sql + selStr + " FROM " + this.dbTable+ whereStr ;
}
/********End Function****/

/**********END********************/

var vetMap=new TblMap('vetTbl','veteran_tbl');

vetMap.addMap('sNum',{'dCol':'service_num'
                  ,'type':'NUM'});
vetMap.addMap('mNum',{'dCol':'mem_num'
                   ,'type':'NUM'});
vetMap.addMap('title',{'dCol':'title'
                   ,'type':'CHAR'});
vetMap.addMap('fName',{'dCol':'first_name'
                   ,'type':'CHAR'});
vetMap.addMap('lName',{'dCol':'last_name'
                   ,'type':'CHAR'});
vetMap.addMap('gender',{'dCol':'gender'
                   ,'type':'CHAR'});

vetMap.addMap('addr1',{'dCol':'address1'
                   ,'type':'CHAR'});
vetMap.addMap('addr2',{'dCol':'address2'
                   ,'type':'CHAR'});
vetMap.addMap('addr3',{'dCol':'address3'
                   ,'type':'CHAR'});
vetMap.addMap('city',{'dCol':'city'
                   ,'type':'CHAR'});
vetMap.addMap('state',{'dCol':'state'
                   ,'type':'CHAR'});
vetMap.addMap('pinCode',{'dCol':'pin_code'
                   ,'type':'NUM'});
vetMap.addMap('trade',{'dCol':'trade'
                   ,'type':'CHAR'});
vetMap.addMap('rankCode',{'dCol':'rank_code'
                   ,'type':'CHAR'});
vetMap.addMap('dojn',{'dCol':'join_dt'
                   ,'type':'DATE'});
vetMap.addMap('dode',{'dCol':'death_dt'
                   ,'type':'DATE'});
vetMap.addMap('dobr',{'dCol':'birth_dt'
                   ,'type':'DATE'});
vetMap.addMap('dods',{'dCol':'discharge_dt'
                   ,'type':'DATE'});
vetMap.addMap('forceType',{'dCol':'force_type'
                   ,'type':'CHAR'});

vetMap.addMap('enrollDt',{'dCol':'enroll_dt'
                   ,'type':'DATE'});

var vetDecorMap=new TblMap('vetDecorTbl','vet_decor_tbl');

vetDecorMap.addMap('sNum',{'dCol':'service_num','type':"NUM"});
vetDecorMap.addMap('decorCode',{'dCol':'decor_code','type':"CHAR"});

var vetPhoneMap=new TblMap('vetPhoneTbl','vet_phone_tbl');

vetPhoneMap.addMap('sNum',{'dCol':'service_num','type':"NUM"});
vetPhoneMap.addMap('phoneType',{'dCol':'phone_type','type':"CHAR"});
vetPhoneMap.addMap('phoneNum',{'dCol':'phone_num','type':"CHAR"});

var circTblColMap={
		'circNum':'circular_num'
		,'ppoType':'ppo_type'
		,'penRateType':'pen_rate_type'
		,'effdt':'effdt'		
		,'circCategory':'circ_category'
		,'serviceYrs':'service_yrs'
		,'penRate':'pension_rate'
		,'circRemarks':'remarks'
	};

function connectSql()
{
	return mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : '',
		  database : 'test'
		});	
}


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


var addVet = function(req,res,callback)
{
	connection = connectSql();

    console.log(req.body);
    sql=vetMap.getInsert(req.body.vetData);
	console.log('insert sql:'+sql);
	connection.query(sql,function(err,result){
		if(!err){
			if(connection.open)
			connection.end();
			console.log('affected rows:'+result.affectedRows);
			if(result.affectedRows>0)
			{				
			if ((req.body.vetDecorData!=null && Object.getOwnPropertyNames(req.body.vetDecorData).length>0)
                ||(req.body.vetPhoneData!=null && Object.getOwnPropertyNames(req.body.vetPhoneData).length>0))
			{
			console.log("now inside the decor and phone ");				
				// callback only after all functions have returned
				var vetAsync = new asyncArr();
				//vetAsync.pushD({});
				
				var vetPhoneData = req.body.vetPhoneData;
				//vetAsync.pushD(vetPhoneData[z]);
				//var vetPhoneData = req.body.vetPhoneData;
				for(var z=0;z< vetPhoneData.length;z++)
				{
					vetAsync.pushF(function(d){					
						return function(data,callback){					
							console.log("-inside closure phone func");
							console.log(d);
							var vetPhoneSql=vetPhoneMap.getInsert(d);
							connection.query(vetPhoneSql,function(err,data){callback(err,data,vetAsync)});					
						};
					}(vetPhoneData[z]) //closure end
					);//func call end
				}

				//vetAsync.pushD(vetDecorData[z]);
				var vetDecorData = req.body.vetDecorData;
				for(var z=0;z< vetDecorData.length;z++)
				{
					vetAsync.pushF(function(d){					
						return function(data,callback){
						
							console.log("-inside closure phone func");
							console.log(d);
							var vetDecorSql=vetDecorMap.getInsert(d);
							connection.query(vetDecorSql,function(err,data){callback(err,data,vetAsync)});
						
						};
						}(vetDecorData[z]) //closure end
					);//func call end
				}

				vetAsync.exec(function(err,data){callback(err,data);});				
				
			}
			 else callback(null,result);
			} else callback(null,result);
		
		}
		else{
			if(connection.open)
			connection.end();
			callback(err,null);
		}
	})
	
};
exports.addNewVeteran= addVet;
exports.parseCSV=function(req,filePath,callback){
	var counter = 0, retCounter=0, totalCount=0, fileEnd,completeCount=0;
	var LineByLineReader = require('line-by-line'),
    //var lr = require('line-reader');
    lr = new LineByLineReader(filePath);
    /*lr.readLine(filePath,function (line,last) {	    
		counter++;		
		
		switch(req.body.uploadItem){
		case 'circular':
			console.log('I am in');
			parseCircCSVLine(req,line, counter, function(err,data) {
				//we have got a call back from parser that one line has been parsed
				retCounter++;
				//log the error
				if(err!=null) {
					errList.push(data.msg+'~'+err.toString())
					console.log(data.msg+'~'+err.toString());
					}
				else console.log(data.msg);
			});
		break;
		default: //veteran file
			
			if(counter>1) //skip header, 1st row			{
				
                parseVetCSVLine(line, counter, function(err,data) {
				retCounter++;
				if(err!=null) {console.log(data.msg+err.toString());}
				else console.log(data.msg);
				});
			}
			else retCounter++;
		}
		
        if(last)
            callback(null,"File reading complete!");
	}
                
                );*/
	var errList=[];
	lr.on('error', function (err) {
	    // 'err' contains error object
	});
	
	lr.on('line', function (line) {
	    // 'line' contains the current line without the trailing newline character.
		//counter++;
        totalCount++; //count read rows
		//if(counter>0)
		{
		switch(req.body.uploadItem){
		case 'circular':
			console.log('I am in');
			parseCircCSVLine(req,line, counter, function(err,data) {
				//we have got a call back from parser that one line has been parsed
				retCounter++;
				//log the error
				if(err!=null) {
					errList.push(data.msg+'~'+err.toString())
					console.log(data.msg+'~'+err.toString());
					}
				else console.log(data.msg);
			});
		break;
		default: //veteran file
			
			if(totalCount>1) //skip header
			{
				parseVetCSVLine(line, counter, function(err,data) { //callback
				completeCount++; //count processed rows
                    console.log("completeCount:"+completeCount+",totalCount:"+totalCount+"fileEnd"+fileEnd);
                    if(fileEnd && totalCount==completeCount)  //call back when total rows are complete
                        callback(null,"all rows processed");
                    
				if(err!=null) {console.log(data.msg+err.toString());}
                    
				else console.log(data.msg);
				});
			}
			else completeCount++;
		}
		//callback(null,{})
		}
	});
	
	lr.on('end', function () {
	    // All lines are read, file is closed now.
		//console.log(retCounter+" and "+counter);
        fileEnd=true;        
        console.log("fileEnd"+fileEnd);
		//if(retCounter==counter)
		//callback("",{retCode:"file complete",'total':counter});
	});
		 
	
};

function parseVetCSVLine(lineStr,counter,callback)
{
	var parse = require('csv-parse');	
	var output = [];
	 var obj={
			 "body":
				 {				
					"vetData":{}
					/*	serviceNum:""
							,afaNum:""
							,effdt:""
							,vetName:""
							,vetCity:""
							,vetRank:""
							,vetInitial:""
							,vetStatus:""
							,vetAdd1:""
							,vetAdd2:""
							,vetAdd3:""
							,vetCity:""
							,vetBranCode:""
							,vetRetireDt:""
							,vetSpouse:""
							,vetEmail:""
							,vetEnrollDt:""
							,vetPpoType:""
							,vetGroupCode:""*/
				
			 }	 
	 };

	output=lineStr.split(/\s*,\s*/);
	var len=output.length;
	//console.log('%%%='+output[0].slice(1));
	//below needed only when there are quotes 
	/*output[0]=output[0].slice(1);	
	output[len-1]=output[len-1].slice(0,output[len-1].length-1);*/
	
	console.log(output);
	 
	 obj.body.vetData.sNum=output[0];
	 obj.body.vetData.mNum=output[1];	 
	 obj.body.vetData.title=output[2];
	 obj.body.vetData.fName=output[3];
	 obj.body.vetData.lName=output[4];	 
	 obj.body.vetData.gender=output[5];
	 obj.body.vetData.dobr=output[6];
	 obj.body.vetData.dode=output[7];
	 obj.body.vetData.addr1=output[8];
	 obj.body.vetData.addr2=output[9];
	 obj.body.vetData.addr3=output[10];
	 obj.body.vetData.city=output[11];
	 obj.body.vetData.state=output[12];
	 obj.body.vetData.pinCode=output[13];
	 obj.body.vetData.rankCode=output[14];
	 obj.body.vetData.dojn=output[15];
	 obj.body.vetData.dods=output[16];
	 obj.body.vetData.trade=output[17];
	 
	 /*obj.body.vetDecorData={};
	 obj.body.vetPhoneData={};*/
	 
	 addVet(obj,{},function(err,data){
		 if(err==null)
			 {
			 console.log(data.affectedRows);
			 callback(err,{"msg":"Line "+counter+": Success:"});
			 }		 
		 else
			 {
			 console.log(err);
			 callback(err,{"msg":"Line "+counter+": Error:"});
			 }
		 
	 });
	 
//	// Now that setup is done, write data to the stream
//	parser.write(lineStr);	
//	// Close the readable stream
//	parser.end();
}


function parseCircCSVLine(req,lineStr,counter,callback)
{
	connection = connectSql();
	var parse = require('csv-parse');	
	var output=lineStr.split(",");
	var colCount=output.length;
	var headerRow=false;
	if(/^[a-zA-Z]*$/.test(output[0])) {headerRow=true; callback("",{"msg":"Line "+counter+": Header Row:"});}
	else{
	var sql="";
	var errMsg="";
	for(var i=1;i<output.length;i++){
		circCategory=i;
		penRate=output[i]; 
		vetServiceYrs=output[0];
		var retColCount=0;
		sql="INSERT INTO circular_tbl values(";
		sql+=req.body.circNum+",";
		sql+="'"+req.body.ppoType+"',";
		sql+="'"+req.body.penRateType+"',";
		sql+="'"+req.body.circEffdt+"',";
		sql+="'"+circCategory+"',";
		sql+=vetServiceYrs+",";
		sql+=penRate+",";
		sql+="'"+req.body.circRemarks+"'";
		sql+=")";
		executeSQL(sql,i,function(err,data){
				retColCount++;	
				console.log("**in exec callback"+",retRowCount="+retColCount+"i="+i);
				if(err!=null) errMsg+=err;		
				if(retColCount==colCount) //once we confirm that all column sqls are executed, we give call back. So, returned col counter == column counter
					if(errMsg=="")
						callback(null,errMsg);
					else
						callback(errMsg,null);
				
			});

		 console.log(sql);
		  
		 }
		 callback("",{"msg":"Line "+counter+": Success:"});
	 }
//	// Now that setup is done, write data to the stream
//	parser.write(lineStr);	
//	// Close the readable stream
//	parser.end();
}
var addDecorF = function(req,res,callback)
{
	connection = connectSql();
	sql = "INSERT INTO vet_decor_ref (`decor_code`, `decor_name`, `decor_descr`) values (" ;
	sql+="'"+req.body.decorCode+"',";
	sql+="'"+req.body.decorName+"',";
	sql+="'"+req.body.decorDescr+"');";
	console.log(sql);
	connection.query(sql,function(err,result){
		if(!err){
			if(connection.open)
			connection.end();
			console.log('affected rows:'+result.affectedRows);
			callback(null,result);
		}
		else{
			if(connection.open)
			connection.end();
			callback(err,null);
		}
	})
};

var addRefDataF = function(req,res,callback)
{
	connection = connectSql();
	var item=req.body.table;
	var sql="";
	if(item=='decors'){
		sql = "INSERT INTO vet_decor_ref (`decor_code`, `decor_name`, `decor_descr`) values (" ;
		sql+="'"+req.body.data.decorCode+"',";
		sql+="'"+req.body.data.decorName+"',";
		sql+="'"+req.body.data.decorDescr+"');";	
	}
	else
		if(item=='ranks'){
			sql = "INSERT INTO vet_rank_ref (`rank_code`, `rank_name`, `rank_descr`) values (" ;
			sql+="'"+req.body.data.rankCode+"',";
			sql+="'"+req.body.data.rankName+"',";
			sql+="'"+req.body.data.rankDescr+"');";	
		}
		else
			if(item=='circCategory'){
				sql = "INSERT INTO circular_category (`rank_code`, `effdt`,`vet_group_cd`,`circ_category`) values (" ;
				sql+="'"+req.body.data.rankCode+"',";				
				sql+="'"+req.body.data.catEffdt+"',";
				sql+="'"+req.body.data.vetGroup+"',";
				sql+=req.body.data.circCategory+");";	
			}
	console.log(sql);
	connection.query(sql,function(err,result){
		if(!err){
			if(connection.open)
			connection.end();
			console.log('affected rows:'+result.affectedRows);
			callback(null,result);
		}
		else{
			if(connection.open)
			connection.end();
			callback(err,null);
		}
	})
};


var getRefDataF = function(req,res,callback)
{
	connection = connectSql();
	var sql="";	
	var table=req.query.table;
	switch(table)
	{
		case 'decors':
			sql = "SELECT decor_code as decorCode, decor_name as decorName, decor_descr as decorDescr from vet_decor_ref;" ;
			break;
		case 'ranks':
			sql = "SELECT rank_code as rankCode, rank_name as rankName, rank_descr as rankDescr from vet_rank_ref;" ;		
			break;
		case 'circCategory':
			sql ="SELECT rank_code as rankCode, DATE_FORMAT(effdt,'%Y-%m-%d') as catEffdt, vet_group_cd as vetGroup, circ_category as circCategory from circular_category;";		
			break;
	}
/*	if(table=='decors')
	sql = "SELECT decor_code as decorCode, decor_name as decorName, decor_descr as decorDescr from vet_decor_ref;" ;
	else
		if(table=='ranks')
			sql = "SELECT rank_code as rankCode, rank_name as rankName, rank_descr as rankDescr from vet_rank_ref;" ;		*/
		
	connection.query(sql, function(err, rows) {
		
		if (!err) {
		  data = rows;
		  console.log("got some rows!!" + data.length);
		  if(data.length<1)
			  {
			  	data=null;
			  }
		  connection.end();
		  callback(null,data);		 
		  }
		else{
			console.log('Error while performing Query.')
			connection.end();
			callback(err,null);
			};
	});
};
var executeSQL=function(sql,index,callback){
	console.log(sql);
	connection.query(sql,function(err,result){
		if(!err){
			if(connection.open)
			connection.end();
			console.log('affected rows:'+result.affectedRows+",index="+index);
			callback(null,result);
		}
		else{
			if(connection.open)
			connection.end();
			console.log('OOPs...it failed!'+",index="+index+"\nerror:"+err.toString());
			callback(err,null);
		}
	})
	
}
updateRefDataF=function(req,res,callback){
	connection = connectSql();
	var item=req.body.table;
	var dataSet=req.body.data;
	var retRowCount=0;
	var errMsg="";
	
		
		for(i=0;i<dataSet.length;i++){
	
			switch(item){
				case 'decors':
				sql = "UPDATE vet_decor_ref set decor_name='";
				sql+=dataSet[i].decorName+"',";
				sql+="decor_descr='"+dataSet[i].decorDescr+"' where decor_code='";
				sql+=dataSet[i].decorCode+"';";
				break;
			
				case 'ranks':				
					sql = "UPDATE vet_rank_ref set rank_name='";
					sql+=dataSet[i].rankName+"',";
					sql+="rank_descr='"+dataSet[i].rankDescr+"' where rank_code='";
					sql+=dataSet[i].rankCode+"';";
					break;
				case 'ranks':
					sql = "UPDATE vet_rank_ref set rank_name='";
					sql+=dataSet[i].rankName+"',";
					sql+="rank_descr='"+dataSet[i].rankDescr+"' where rank_code='";
					sql+=dataSet[i].rankCode+"';";
					break;
				case 'circCategory':
					sql = "UPDATE circular_category set rank_code='";
					sql+=dataSet[i].rankCode+"',";
					sql+="effdt='"+dataSet[i].catEffdt+"',";
					sql+="vet_group_cd='"+dataSet[i].vetGroup+"',";
					sql+="circ_category="+dataSet[i].circCategory+" ";
					sql+=" where ";
					sql+="rank_code='"+dataSet[i].rankCode_old+"' and ";
					sql+="effdt='"+dataSet[i].catEffdt_old+"' and ";
					sql+="vet_group_cd='"+dataSet[i].vetGroup_old+"' and ";
					sql+="circ_category="+dataSet[i].circCategory_old+"";
					break;
			}
			
			executeSQL(sql,i,function(err,data){
				retRowCount++;	
				console.log("**in exec callback"+",retRowCount="+retRowCount+"i="+i);
				if(err!=null) errMsg+=err;		
				if(retRowCount==dataSet.length)
					if(errMsg=="")
						callback(null,errMsg);
					else
						callback(errMsg,null);
				
			});
			console.log("++after call: "+i+",retRowCount="+retRowCount+"dataSet.length="+dataSet.length);
		}
		
	
}

deleteRefDataF=function(req,res,callback){
	connection = connectSql();
	var item=req.body.table;
	var dataSet=req.body.data;
	var retRowCount=0;
	var errMsg="";
	
		
		for(i=0;i<dataSet.length;i++){
			
			switch(item)
			{
				case 'decors':
				sql = "DELETE from vet_decor_ref where decor_code='";	
				sql+=dataSet[i].decorCode+"';";
				break;
				
				case 'ranks':
				sql = "DELETE from vet_rank_ref where rank_code='";	
				sql+=dataSet[i].rankCode+"';";
				break;
				
				case 'circCategory':
				sql = "DELETE from circular_category where ";				
				sql+="rank_code='"+dataSet[i].rankCode+"' ";
				sql+="and effdt='"+dataSet[i].catEffdt+"' ";
				sql+="and vet_group_cd='"+dataSet[i].vetGroup+"' ";
				sql+="and circ_category="+dataSet[i].circCategory+" ";
				break;
			}
			
			executeSQL(sql,i,function(err,data){
				retRowCount++;	
				console.log("**in exec callback"+",retRowCount="+retRowCount+"i="+i);
				if(err!=null) errMsg+=err;		
				if(retRowCount==dataSet.length)
					if(errMsg=="")
						callback(null,errMsg);
					else
						callback(errMsg,null);
				
			});
			console.log("++after call: "+i+",retRowCount="+retRowCount+"dataSet.length="+dataSet.length);
		}
		
	
}

var createWhere=function(req,callback){
		var filterList = req.body.filterList;
			sql = "SELECT ppo_type as ppoType, pen_rate_type as penRateType, DATE_FORMAT(effdt,'%Y-%m-%d') as effdt, circular_num as circNum, circ_category as circCategory, service_yrs as serviceYrs, pension_rate as penRate, remarks as circRemarks from circular_tbl " ;
			if(filterList.length>0 )
			{
				var where=" ";				
				for(var i=0;i<filterList.length;i++){
						
						if(i==0) where +=" WHERE ";
						else where +=" AND ";
						where += circTblColMap[filterList[i].field];
						where +=filterList[i].operator;
						if(filterList[i].number=='Y') where+=filterList[i].value;
						else{
							where+=" '"+filterList[i].value+"'";	
						}
				}
			sql+=" "+where;
			callback(sql);
			}
}
var getCircDataF = function(req,res,callback){


	var sql="";	
	
	//var table=req.query.table;
	console.log(req.body);
	
//	var filterList = req.body.filterList;
	sql = "SELECT ppo_type as ppoType, pen_rate_type as penRateType, DATE_FORMAT(effdt,'%Y-%m-%d') as effdt, circular_num as circNum, circ_category as circCategory, service_yrs as serviceYrs, pension_rate as penRate, remarks as circRemarks from circular_tbl " ;
	
	createWhere(req, function(where){
		connection = connectSql();
		sql += " ORDER BY serviceYrs, circCategory";
		console.log(sql);
		
		connection.query(sql, function(err, rows) {
			
					if (!err) {
					  data = rows;
					  console.log("got some rows!!" + data.length);
					  if(data.length<1)
						  {
							data=null;
						  }
					  connection.end();
					  var penYearList=[];
					  //var penYearObj={};
					  var prevYear=0;
					  var pYLC =1;
					  var pYAI=0;
					  var penYearArr=[];
					  console.log(data[0].serviceYrs);
					  for(var idx=0; idx<data.length; idx++){
						  console.log(idx);
						  if(data[idx].serviceYrs!=prevYear) {
							//for break in year, insert accumulated year array, reset it	
							if(penYearArr.length>0) penYearList.push(penYearArr);
							penYearArr =[];				  
							penYearArr[0]=data[idx].serviceYrs;
								
						  }
							  //category serving as index
							  pYAI=data[idx].circCategory;
							  penYearArr[pYAI]=data[idx].penRate;				  			  			  
							  prevYear=data[idx].serviceYrs;
							 
					  }
					  //push the last row
					  //if(data[idx-1].serviceYrs!=prevYear) {
							//for break in year, insert accumulated year array, reset it	
							if(penYearArr.length>0) penYearList.push(penYearArr);
							penYearArr =[];				  
							//penYearArr[0]=data[idx].serviceYrs;
								
						//  }
					  callback(null,penYearList);		 
					  }
					else{
						console.log('Error while performing Query.'+"\n error:"+err.toString())
						connection.end();
						callback(err,null);
						};
				});		
			
			
		});
	
};

var deleteCircDataF=function(req,callback){

	//use the filters from req
		//construct the delete sql
			//give callback
	var sql="DELETE FROM CIRCULAR_TBL ";
		createWhere(req, function(where){
			sql+=where;
			connection = connectSql();
			connection.query(sql, function(err, rows) {
				callback(err);
			});
		});//end of createWhere
}

var getLookupF=function(req,callback)
{
	connection=connectSql();
	var tblMap=lookupTblMap;
	console.log(req.query.source);
    console.log(tblMap[req.query.source][0]);
	var sql="SELECT "+ tblMap[req.query.source][0]+ " as code,"+ tblMap[req.query.source][1]+ " as descr FROM " + tblMap[req.query.source][2];
	connection.query(sql, function(err,rows)
		{
		var list={};
		console.log(sql);
		console.log(rows);
		if(!err) callback("",rows);
		});
}

function searchVetF(req,res,callback){
     console.log("in search vet....");
	 console.log("Data",req.body.whereData);
	 vetMap.whereObj=req.body.whereData;	 
	 var sql=vetMap.getSelect("*");
	 console.log(sql);
       connection=connectSql();
	   connection.query(sql,function(err,rows){		   	
	   console.log(rows);
			callback(err,rows);
	   });
	   
	   
}

function updateVetF(req,res,callback){
	console.log("in updateVet");
	var vetObjArr=req.body.vetObjArr;
	//console.log(vetArr);
	var retC=0,errC=0, maxRetC=2;
	updateVerPerInfo(req,function(err,data){
		retC++;
		if(retC==maxRetC){
			callback(err,data);
			console.log("b4 Perinfo callback");
		}
		});
	updateVerPhoneInfo(req,function(err,data){
		retC++;
		if(retC==maxRetC)
		{
			console.log("b4 phoneinfo callback");
			callback(err,data);}
		});	
	
	//callback("","");
	
}

function updateVetPerInfo(req,callback){
	
	var vetObjArr=req.body.vetObjArr;
	//console.log(vetArr);
	var errC=0;
	for(var i=0,len=vetObjArr.length;i<len;i++)
	{
		//call update module from the tbmap for each vetObj
		var vetObj = vetObjArr[i]
		var sql=vetMap.getUpdate(vetObj.setValObj,vetObj.whereObj);
		console.log(sql);	
		connection=connectSql();
		connection.query(sql,function(err,data){
			retC++;
			if(err!=null) errC++;
			
			if (retC==len) callback(null,{errCount:errC,msg:"success"})
		})
	}
	//callback("","");
}
function updateVetPhoneInfo(req,callback)
{
	var phoneObjArr = req.body.phoneObjArr;
	for(var i=0,len=phoneObjArr.length;i<len;i++)
	{
		//call update module from the tbmap for each vetObj
		var phoneObj = phoneObjArr[i]
		var sql=vetMap.getUpdate(phoneObj.setValObj,phoneObj.whereObj);
		console.log(sql);	
		connection=connectSql();
		connection.query(sql,function(err,data){
			retC++;
			if(err!=null) errC++;
			
			if (retC==len) callback(null,{errCount:errC,msg:"success"})
		})
	}
	
}
exports.getVetInfo = function(req,res,callback){
	//console.log("calling getVet");
	console.log(req.body);
	if(req.body.data.item=='decor'){
		connection=connectSql();
		vetDecorMap.whereObj={"sNum":req.body.data.sNum};
		var sql=vetDecorMap.getSelect("*");
		connection.query(sql,function(err,rows){
			callback(err,rows);
		});
		
	}
	else if(req.body.data.item=='phone'){
		connection=connectSql();
		vetPhoneMap.whereObj={"sNum":req.body.data.sNum};
		var sql=vetPhoneMap.getSelect("*");
		connection.query(sql,function(err,rows){
			callback(err,rows);
	 });
	}
		
};

//exports.addDecor=addDecorF;
//exports.getDecor=getDecorF;
exports.addRefData=addRefDataF;
exports.getRefData=getRefDataF;
exports.getCircData=getCircDataF;
exports.updateRefData=updateRefDataF;
exports.deleteRefData=deleteRefDataF;
exports.deleteCircData=deleteCircDataF;
exports.searchVet=searchVetF;
exports.updateVet=updateVetF;
//exports.addCircularCategory=addCircularCategoryF;
exports.getLookup=getLookupF;
