/**
 * New node file
 */

function getVet(){
$.ajax({url:'/api'
	,success:function (data) {
		var vets = [];
		$("#lbl1").text("success"+data[0].location);
		
		$.each(data, function (key,val) {
			vets.push("<h2 id='" + key + "'>" + val + "</h2>" );
			alert(val);
				});
				$( "<h1/>", {
				    "class": "my-new-list",
				    html: vets.join( "" )
				  }).appendTo( "body" );
				}		
		
	,error:function () {
	$("#lbl1").text("OOps");}	
	});
	}
	
function getVetSearchRes(vetId,callback){

$.ajax(
	{url:'/api/GetVet'
	,type:'POST'
	,data:{"vetId":vetId}
	/*,function(data){
	if(data=='yes')alert('Yahoo!'); else alert('Baamm');
	}*/
	,success:function(result){ 
	    //resObj = JSON.parse(result);
		//alert(resObj.retCode);		
		callback(result);
	}
	,error:function(result){alert('Not Found!'); callback(result);}
	});
}

function addNewVeteran(vetObj,callback){
	
	$.ajax(
	{
		url:'/api/AddVet',
		type:'POST',
		data:vetObj,
		success: function(result){callback(result);},
		error: function(result){callback(null);}		
	}		
	);
}
function uploadVetCsv(){
	
};