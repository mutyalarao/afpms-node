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
		var vetObj = {				
				serviceNum:""
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
					,vetGroupCode:""
		};
		vetObj.serviceNum=i.vet.serviceNum
		vetObj.afaNum	 =i.vet.afaNum	 
		vetObj.effdt	 =i.vet.effdt	 
		vetObj.vetName	 =i.vet.name	 
		vetObj.vetAdd1=i.vet.add1
		vetObj.vetAdd2=i.vet.add2
		vetObj.vetAdd3=i.vet.add3
		vetObj.vetCity	 =i.vet.city
		vetObj.vetRank=i.vet.rank
		vetObj.vetGroupCode==i.vet.groupCode
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

