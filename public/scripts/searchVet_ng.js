angular.module('searchVet',[]).controller('VetController',function($scope,$http){
	/*
	Variable Map:
	(1)z.rsltArr - Array - Main/Active Placeholder for search results
	(2)z.rslt - Object - For current projected veteran object from rsltArr
	(3)z.rsltArrO - Array - Clone of the z.rsltArr. Used to store snapshot to reset to.
	(4)z.curIdx - Integer - to store the current projected object's index in z.rsltArr. Init to -1.
	
	Event Map:
	(+)Click Search - Post request. Returns hit veterans' complete data objects into *z.rsltArr*
	(+)Click on Vet Id Link - projectVet(). use the index from the ng on z.rsltArr.
	(+)Click on Reset
	(+)Click on Save
	
	
	*/
	var z=$scope;

	var rsltObj={};
	var rsltIndexArr=[];
	/*
	-Init Module
	*/
	z.init=function(){
	z.rsltObj={};
	z.rsltArr=[];
	z.rsltArrO=[];
	z.rsltPad=[];
	z.curIdx=-1;
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
				z.rsltArrO=cloneObject(z.rsltArr); //Clone the array for reset
				console.log(data.data);
				})
				.error(function(data)
						{
						//alert('Not Found!'); 
						});
	}
	
	z.projectVet=function(idx){
		//console.log(z.rsltArr[idx].sNum);
		z.curIdx=idx;
		z.rslt=z.rsltArr[idx];		
		getDecorData(idx,z.rsltArr[idx].sNum);			
		getPhoneData(idx,z.rsltArr[idx].sNum);
		console.log(z.rsltArr[idx]);
	}
	
	
	/*
	-set the changed flag of z.rsltArr
	*/
	z.setChanged=function(){
		z.rsltArr[z.curIdx].changed=true;
		console.log("in changeVetField: "+z.rsltArr[z.curIdx].changed)
	}
	
	z.setPhoneChanged=function(pIndex){
		console.log("in setPhoneChanged: "+pIndex);
		z.rsltArr[z.curIdx].phoneArr[pIndex].changed=true;
		z.rsltArr[z.curIdx].changed=true;
		
		console.log(z.rsltArr[z.curIdx]);
	}
	
	z.setDecorChanged=function(dIndex){
		z.rsltArr[z.curIdx].decorArr[dIndex].changed=true;
		z.rsltArr[z.curIdx].changed=true;
		console.log("in setDecorChanged: ");
		console.log(z.rsltArr[z.curIdx]);
	}
	
	z.isChanged=function(idx){
		console.log("changed: "+z.rsltArr[idx].changed)
		return z.rsltArr[idx].changed
	}

	/*
	RESET the values of the Vet form to the last saved ones. 
	## For now this module will reset *ALL* changed objects of rsltArr 
	-Loop through rsltArr looking for changed = true
	-Copy rsltArrO[i] to rsltArr[i]
	-set changed to false
	*/
	z.resetChanges=function(){
		for (var i=0,len=z.rsltArr.length;i<len;i++)
		{
			if(z.rsltArr[i].changed==true)
			{
				//console.log("before | old:"+z.rsltArrO[i].fName+",new:"+z.rsltArr[i].fName)
				z.rsltArr[i].changed=false;
				z.rsltArr[i]=cloneObject(z.rsltArrO[i]);
				if(z.curIdx>=0){ 
					z.rslt=z.rsltArr[z.curIdx];
					z.decorArr=z.rsltArr[z.curIdx].decorArr;
					z.phoneArr=z.rsltArr[z.curIdx].phoneArr;
				}
				console.log("dumping z.rslt from idx:"+z.curIdx);
				console.log(z.rslt);
				//console.log("after | old:"+z.rsltArrO[i].fName+",new:"+z.rsltArr[i].fName)
			}
		}
	}
	
	/*
	Module to Save any changed objects from rsltArr
	-Loop through rsltArr looking for changed = true
	-Fire Post requests for each
	-Copy rsltArr[i] to rsltArrO[i]
	-set changed to false
	
	POST data layout:
	vetUpdateArray[
		vet{ setObj{}, whereObj{} }
	]
		
	*/
	z.saveChanges=function(){
		var vetObjArr=[];
		
		for (var i=0,ilen=z.rsltArr.length;i<ilen;i++)
		{
			console.log("i:"+i+",rsltArr:"+z.rsltArr[i].changed);
			//vetObjArr.length=0; //Re-init the array
			if(z.rsltArr[i].changed==true)
			{				
				var vetObj={};
				var whereObj={},setValObj={};
				console.log(z.rsltArr[i])
				var propArr=Object.getOwnPropertyNames(z.rsltArr[i]);
				
				for(var j=0,jlen=propArr.length; j<jlen;j++)
				{
					//console.log("propArr[j]:"+propArr[j])
					
					if(typeof(z.rsltArr[i][propArr[j]])!='object') // if not a object, match with original, store as setValObj[m]
					{
						console.log("Current:"+z.rsltArrO[i][propArr[j]]+",Old:"+z.rsltArr[i][propArr[j]]);
						if(z.rsltArrO[i][propArr[j]]!=z.rsltArr[i][propArr[j]] && propArr[j]!='changed')
						{
						setValObj[propArr[j]]=z.rsltArr[i][propArr[j]];
						}
					}
					whereObj.sNum=z.rsltArr[i].sNum;
					vetObj.whereObj=whereObj;
					vetObj.setValObj=setValObj;
				}	
				
				vetObjArr.push(vetObj);
				z.rsltArrO[i]=cloneObject(z.rsltArr[i]);
				z.rsltArr[i].changed=false;
			}
		}
		console.log("dumping vetObjArr...")
			console.log(vetObjArr);
			var postData={};
			postData.vetObjArr=vetObjArr;
			$http.post('/api/updateVet',postData)
			.success(function(data){
				alert('success');
			})
			.error(function(data){
				
			});
			//console.log(vetObjArr[0].);
			//console.log(vetObjArr[0].sNum);
			//console.log(vetObjArr[0].whereObj);
	}
	getDecorData=function(idx,sNum){
		if(!z.rsltArr[idx].decorArr)
		$http.post('/api/getVetInfo',{"data":{"sNum":sNum,"item":"decor"}})
		.success(function(data){
			console.log(data.data);
			z.rsltArr[idx].decorArr=data.data;
			z.decorArr=z.rsltArr[idx].decorArr;
			//Saving Original
			z.rsltArrO[idx].decorArr=cloneObject(z.rsltArr[idx].decorArr);
		})
		.error(function(data){
			console.log(z.rsltArr[idx]);
		});
		else
		{
			z.decorArr=z.rsltArr[idx].decorArr;
		}
		
	}
	
	getPhoneData=function(idx,sNum){
		if(!z.rsltArr[idx].phoneArr)
		$http.post('/api/getVetInfo',{"data":{"sNum":sNum,"item":"phone"}})
		.success(function(data){
			console.log(data.data);
			z.rsltArr[idx].phoneArr=data.data;
			z.phoneArr=z.rsltArr[idx].phoneArr;
			//Saving Original
			z.rsltArrO[idx].phoneArr=cloneObject(z.rsltArr[idx].phoneArr);
		})
		.error(function(data){
			console.log(z.rsltArr[idx]);
		});
		else
		{
			z.phoneArr=z.rsltArr[idx].phoneArr;
		}
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

cloneObject=function(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}	
});
		
