 var app=angular.module('afpmsSetup',[]);
	app.controller('setupController',function($scope,$http){
    var z=$scope;
	z.rankFlag=false;
	z.page='';  
	z.objSelectedCount=0;
	z.refObjArray=[];
	z.isObjEditable=function(i){
		return z.refObjArray[i].editable;
		//else return false;
	}
//	z.objDecor=function(i){
//		if(z.refObjArray[i].editable=="Y")z.refObjArray[i].editable="N";
//		else
//		z.refObjArray[i].editable="Y";
//	}
	pageInit = function(){
		
		z.refObjArray=[];
		z.decorCode="";
		z.decorName="";
		z.decorDescr="";
		z.objSelectedCount=0;
		//z.objSelected=false;
	}
    z.showPage=function(pageCode){ //alert('hi');
		z.page=pageCode;
		pageInit();
		z.getRefData(z.page);
	};        
    z.initSetup=function(){
     z.page='';
    };
    z.editObj=function(i){
    	z.refObjArray[i].editable=!z.refObjArray[i].editable;
    }
//    z.getDecor=function(){
//    	$http.get('/api/getDecor')
//    	.success(function(res){
// 			console.log(res); 			
// 			z.refObjArray=res.data; 
// 			
//    	})
//    	.error(
//    		function(err,data){console.log("error");
//    		alert('ss');
//    			}
//    	);
//    	
//    }
//    
    z.getRefData=function(item){
    	var url="/api/getRefData?table="+item;

    		$http.get(url)
        	.success(function(res){     			 			
     			z.refObjArray=res.data;    		
        	})
        	.error(
        			function(err,data){console.log("error");
        			alert('ss');
        			z.refObjArray.length=0;
    			}
    	);
    	
    }
//	z.addDecor=function(){
//				z.decorObj.decorCode=z.decorCode;
//				z.decorObj.decorName=z.decorName;
//				z.decorObj.decorDescr=z.decorDescr;
//				var str = z.decorObj.decorCode + z.decorObj.decorName + z.decorObj.decorDescr;
//				console.log(z.decorObj)
//				$http.post('/api/addDecor'
//					,z.decorObj)
//					.success(function(err,data){
//					if(err==null) {alert('Success'); z.getRefData();}
//					else
//						alert('failed'+err.err)
//					})
//					.error(function(err,data){
//						alert('Fatal error')
//					});
//
//				
//				//alert(str);
//	}
	
	z.addRefObj=function(item){
		var url='';
		var refObj={};
		var refData={};
		if(item=='decors'){
			refData.decorCode=z.decorCode;
			refData.decorName=z.decorName;
			refData.decorDescr=z.decorDescr;
		}	
		else
			if(item=='ranks'){
				refData.rankCode=z.rankCode;
				refData.rankName=z.rankName;
				refData.rankDescr=z.rankDescr;
			}
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
	
	z.updateRefObj=function(item){
		var url='/api/updateRefData';
		var refObj={};
		var refData=[];
		console.log(z.refObjArray)
		if(item=='decors'){
		for(var i=0,j=0;i<z.refObjArray.length;i++)
			{
			if(z.refObjArray[i].changed)
				{
				refData[j]={};
				refData[j].decorCode=z.refObjArray[i].decorCode;
				refData[j].decorName=z.refObjArray[i].decorName;
				refData[j].decorDescr=z.refObjArray[i].decorDescr;
				j++;
				}
			}
		}
		else
			if(item=='ranks'){
				for(var i=0,j=0;i<z.refObjArray.length;i++)
				{
				if(z.refObjArray[i].changed)
					{
					refData[j]={};
					refData[j].rankCode=z.refObjArray[i].rankCode;
					refData[j].rankName=z.refObjArray[i].rankName;
					refData[j].rankDescr=z.refObjArray[i].rankDescr;
					j++;
					}
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
	
	z.changeRefObj=function(i){		
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
				refData[j].decorCode=z.refObjArray[i].decorCode;				
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
	z.saveSetup=function(item){
		
		if(item="decors"){
		z.setupObj.decorCode=z.decorCode;
		z.setupObj.decorName=z.decorName;
		z.setupObj.decorDescr=z.decorDescr;
		} 
		
		
		
		$http.post('/api/addDecor'
			,z.setupObj)
			.success(function(err,data){
			if(err==null) {alert('Success'); z.getObj();}
			else
				alert('failed'+err.err)
			})
			.error(function(err,data){
				alert('Fatal error')
			});

		
		//alert(str);
}
	});