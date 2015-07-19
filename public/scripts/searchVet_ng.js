angular.module('searchVet',[]).controller('VetController',function($scope,$http){
	
	var z=$scope;

	var rsltObj={};
	var rsltIndexArr=[];
	
	z.init=function(){
	z.rsltObj={};
	z.rsltArr=[];
	z.rsltPad=[];
	z.lookupRefObj={};
	getLookupArr('decor',function(data){z.lookupRefObj['decor']=data; console.log(z.lookupRefObj);});
            //getLookupArr('rank',function(data){i.lookupRefObj['rank']=data; console.log(i.lookupRefObj);});
			getLookupArr('phone',function(data){z.lookupRefObj['phone']=data; console.log(z.lookupRefObj);});
	}
	
	getCriteria=function () {
		var critObj={};		
		critObj=z.criteria;
		//build an object of criteria		
		/*critObj.sNum=z.criteria.sNum;
		critObj.mNum=z.criteria.mNum;
		critObj.fName=z.criteria.fName;*/	
		return critObj; 
		}
		
	z.goSearch = function(){		
	
		//call a HTTP get with the criteria				
		console.log(getCriteria());		
		var postData={};
		postData.whereData=getCriteria();	
		$http.post('/api/searchVet'
				,postData)								
				.success(function(data){ 
				//fill the rsltObj	
				z.rsltArr=data.data;	    		
				console.log(data.data);
				})
				.error(function(data)
						{
						//alert('Not Found!'); 
						});
	}
	
	z.projectVet=function(idx){
		//console.log(z.rsltArr[idx].sNum);
		z.rslt=z.rsltArr[idx];		
		getDecorData(idx,z.rsltArr[idx].sNum);			
		getPhoneData(idx,z.rsltArr[idx].sNum);
		console.log(z.rsltArr[idx]);
	}
	
	getDecorData=function(idx,sNum){
		if(!z.rsltArr[idx].decorArr)
		$http.post('/api/getVetInfo',{"data":{"sNum":sNum,"item":"decor"}})
		.success(function(data){
			console.log(data.data);
			z.rsltArr[idx].decorArr=data.data;
			z.decorArr=z.rsltArr[idx].decorArr;
		})
		.error(function(data){
			console.log(z.rsltArr[idx]);
		});
		
	}
	
	getPhoneData=function(idx,sNum){
		if(!z.rsltArr[idx].phoneArr)
		$http.post('/api/getVetInfo',{"data":{"sNum":sNum,"item":"phone"}})
		.success(function(data){
			console.log(data.data);
			z.rsltArr[idx].phoneArr=data.data;
			z.phoneArr=z.rsltArr[idx].phoneArr;
		})
		.error(function(data){
			console.log(z.rsltArr[idx]);
		});
	}
	
	var getLookup=function(source,target){

	//issue a HTTP get with the source
	$http.get('/api/getLookup',{params:{'source':source}})
	.success(function(res){
//		console.log(res.data);
		var data = res.data;
		//type assumed as SELECT
		var targetJ="#"+target;
		$(targetJ).empty();
		for(var j=0;j<data.length;j++){
//		console.log(data[j].code);
		$("<option></option>").val(data[j].code).text(data[j].descr).appendTo(targetJ);
		}
		$(targetJ).val('');
	})
	.error(function(err,data){console.log(err);});
	
	}

var getLookupArr=function(source,callback){

	//issue a HTTP get with the source
	$http.get('/api/getLookup',{params:{'source':source}})
	.success(function(res){
		console.log(res.data);
		//i.lookupRefObj[source] = res.data.slice();
        //console.log(res.data);
		callback(res.data);
        //test();
	})
	.error(function(err,data){
        
        console.log(err);});
	
	}
	
z.downloadTemplate=function(item){

	$http.get('/api/getFile',{params:{'item':'vetDetails'}})
	.success(function(res){
		
	})
	.error(function(res){alert('OOps');});
}
	
});
		
