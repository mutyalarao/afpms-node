angular.module('addVet',[]).controller('addVetController',function($scope,$http){
	
	//var vetCtrl = this;
	//var vetId = vetCtrl.search.vetId;
	var i=$scope;
	var page='';
	i.initForm=function(){
		i.addMode='none'
		i.page='';

	}
	i.showPage=function(page){
		i.page=page;
		if(page=='addVet')
		{
		  getLookup("rank","add_vet_rankCode");
		}
	}

	/*i.uploadVeteranFile=function(){
		
		  var formObj = $(this);
		    var formURL = formObj.attr("action");
		    var formData = new FormData(this);
		    $http.post( formURL,formData,
		    		{  headers: {'Content-Type': undefined}}
		    )
		    .success( function(data)
		    {
		 		alert(data);
		    })
		     .error(function(jqXHR, textStatus, errorThrown) 
		     {
		     }          
		    );		    
	}*/
	i.addVeteran=function(){
		var vetData={};
        var vetObj = {								
		};
		vetData.sNum=i.add.sNum
		vetData.mNum	 =i.add.mNum	 
		vetData.dobr =i.add.dobr	 
        vetData.dode =i.add.dode	 
        vetData.dojn =i.add.dojn
        vetData.dods =i.add.dods
        vetData.enrollDt =i.add.enrollDate	 
		vetData.fName =i.add.fName	 
        vetData.lName =i.add.fName	
        vetData.gender =i.add.gender	 
		vetData.addr1=i.add.addr1
		vetData.addr2=i.add.addr2
		vetData.addr3=i.add.addr3
		vetData.city	 =i.add.city
        vetData.state	 =i.add.state
        vetData.pinCode=i.add.pinCode
		vetData.trade=i.add.trade
        vetObj.data=vetData;        		
		console.log(vetObj);
		$http.post('/api/AddVet',vetObj)
		.success(function(err,data){
			if(err==null) alert('Success');
			else
				alert('failed'+err.err)
		})
		.error(function(err,data){
			alert('Fatal error')
		})
	}
	var getLookup=function(source,target){

	//issue a HTTP get with the source
	$http.get('/api/getLookup',{params:{'source':'rank'}})
	.success(function(res){
		console.log(res.data);
		var data = res.data;
		//type assumed as SELECT
		var targetJ="#"+target;
		$(targetJ).empty();
		for(var j=0;j<data.length;j++){
		console.log(data[j].code);
		$("<option></option>").val(data[j].code).text(data[j].descr).appendTo(targetJ);
		}
		$(targetJ).val('');
	})
	.error(function(err,data){console.log(err);});
	
	}

});

