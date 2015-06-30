 var app=angular.module('afpmsCircular',[]);
	app.controller('circularController',function($scope,$http){
    var z=$scope;	
	z.page='';  
	z.objSelectedCount=0;
	z.refObjArray=[];
	z.setupObjArray=[];
	z.ppoType="";
	z.appBusy=false;
	/******************
	*UTILITY FUNCTIONS*
	********************/
	z.isObjEditable=function(i){
		return z.refObjArray[i].editable;
		//else return false;
	}
	
		z.changeRefObj=function(i,field){		
			z.refObjArray[i].changed=true;			
	}

	z.selectRefObj=function(index){
		if(z.refObjArray[index].objSelected)
			z.objSelectedCount++;		
		else
			z.objSelectedCount--;
		//z.refObjArray[index].selected=true;
		console.log("z.objSelectedCount="+z.objSelectedCount+"z.refObjArray[index].selected="+z.refObjArray[index].objSelected);
	}

	pageInit = function(){
		
		z.setupObjArray=[];
		z.refObjArray=[];
		z.rankCode="";
		z.catEffdt="";
		z.circCategory="";
		z.vetGroup="";
		z.objSelectedCount=0;
		z.ppoType="";
		//z.objSelected=false;
	}
    z.showPage=function(pageCode){ //alert('hi');
		z.page=pageCode;	
		pageInit();
		z.getRefData(pageCode);
		
	};        
    z.initSetup=function(){
     z.page='';
    };
    z.editObj=function(i){
    	z.refObjArray[i].editable=!z.refObjArray[i].editable;
    }
    /********************/
	
	z.addCategory=function(item){
		var url='';
		var refObj={};
		var refData={};
		
			refData.rankCode=z.rankCode;
			refData.catEffdt=z.catEffdt;
			refData.vetGroup=z.vetGroup;
			refData.circCategory=z.circCategory;
		
			refObj.table=item;	
			refObj.data=refData;
			console.log(refObj);	
		$http.post('/api/addRefData'
			,refObj)
			.success(function(err,data){
			if(err==null) {alert('Success'); z.getRefData(item);}
			else
				alert('failed'+err.err)
			})
			.error(function(err,data){
				alert('Fatal error')
			});
	}
	
	z.getRefData=function(item){
		if(item=='circCategory'){
    	var url="/api/getRefData?table="+item;

    		$http.get(url)
        	.success(function(res){     			 			
     			z.refObjArray=res.data;
				saveOldCatValues(z.refObjArray);
        	})
        	.error(
        			function(err,data){console.log("error");
        			alert('ss');
        			z.refObjArray.length=0;
    			}
    	);
		}
    	
    }
	saveOldCatValues=function(obj){
		if(obj!=null)
		for(var i=0;i<obj.length;i++)		
		{
			obj[i].rankCode_old=obj[i].rankCode;
			obj[i].vetGroup_old=obj[i].vetGroup;
			obj[i].catEffdt_old=obj[i].catEffdt;
			obj[i].circCategory_old=obj[i].circCategory;			
		}
	}
	z.deleteRefObj=function(item){
		var url='/api/deleteRefData';
		var refObj={};
		var refData=[];
		console.log(z.refObjArray)
		for(var i=0,j=0;i<z.refObjArray.length;i++)
			{
			if(z.refObjArray[i].objSelected)
				{
				refData[j]={};
				refData[j].rankCode=z.refObjArray[i].rankCode;				
				j++;
				}
			}
						
			refObj.table=item;	
			refObj.data=refData;
			console.log(refObj);
			
		$http.post(url
			,refObj)
			.success(function(err,data){
			if(err==null) {alert('Success'); z.getRefData(item);}
			else
				alert('failed'+err.err)
			})
			.error(function(err,data){
				alert('Fatal error')
			});
		
	}		

	z.updateRefObj=function(item){
		var url='/api/updateRefData';
		var refObj={};
		var refData=[];
		var chgdFlag=false;
		console.log(z.refObjArray)
		if(item=='circCategory'){
		for(var i=0,j=0;i<z.refObjArray.length;i++)
			{
			if(z.refObjArray[i].changed)
				{
				//chgdFlag=true;
				refData[j]={};
				refData[j].rankCode=z.refObjArray[i].rankCode;
				refData[j].catEffdt=z.refObjArray[i].catEffdt;
				refData[j].vetGroup=z.refObjArray[i].vetGroup;
				refData[j].circCategory=z.refObjArray[i].circCategory;
				refData[j].rankCode_old=z.refObjArray[i].rankCode_old;
				refData[j].catEffdt_old=z.refObjArray[i].catEffdt_old;
				refData[j].vetGroup_old=z.refObjArray[i].vetGroup_old;
				refData[j].circCategory_old=z.refObjArray[i].circCategory_old;
				j++;
				}
			}
		}
		//console.log(refData.length);
		if(refData.length>0){	
			refObj.table=item;	
			refObj.data=refData;
			//console.log(refObj);
			
		$http.post(url
			,refObj)
			.success(function(err,data){
			if(err==null) {alert('Success'); z.getRefData(item);}
			else
				alert('failed'+err.err)
			})
			.error(function(err,data){
				alert('Fatal error')
			});
		}
	}
z.deleteRefObj=function(item){
		var url='/api/deleteRefData';
		var refObj={};
		var refData=[];
		console.log(z.refObjArray)
		for(var i=0,j=0;i<z.refObjArray.length;i++)
			{
			if(z.refObjArray[i].objSelected)
				{
				refData[j]={};
				refData[j].rankCode=z.refObjArray[i].rankCode;				
				refData[j].catEffdt=z.refObjArray[i].catEffdt;				
				refData[j].vetGroup=z.refObjArray[i].vetGroup;				
				refData[j].circCategory=z.refObjArray[i].circCategory;				
				j++;
				}
			}
						
			refObj.table=item;	
			refObj.data=refData;
			console.log(refObj);
			
		$http.post(url
			,refObj)
			.success(function(err,data){
			if(err==null) {alert('Success'); z.getRefData(item);}
			else
				alert('failed'+err.err)
			})
			.error(function(err,data){
				alert('Fatal error')
			});
		
	}	
var createFilter=function(fieldName,fieldVal,number,list){
		var filter={};	
	if(fieldVal){	
		console.log(fieldVal);
		filter.field=fieldName;
		filter.operator = "=";	
		filter.value=fieldVal;
		filter.number=number;
		list.push(filter);		
		//return filter;
	}
	
}
z.getCircularTable=function(){
	//construct the filterList from the inputs
	
	var filterListObj={};
	var filterList=[];
	createFilter('ppoType',z.ppoType,"N",filterList);
	createFilter('effdt',z.circEffdt,"N",filterList);
	createFilter('circNum',z.circNum,"Y",filterList);
	createFilter('penRateType',z.penRateType,"N",filterList);
	
	console.log(filterList);
	filterListObj.filterList=filterList;
	//call http.get /api/getCircData 	
		var url="/api/getCircData";

    		$http.post(url,filterListObj)
        	.success(function(res){     			 			
     			z.penYearList=res.data;
				//saveOldCatValues(z.refObjArray);
        	})
        	.error(
        			function(err,data){console.log("error");
        			alert('ss');
        			//z.refObjArray.length=0;
    			}
    	)
	
}
	

	
	}); // END of controller
	
	
