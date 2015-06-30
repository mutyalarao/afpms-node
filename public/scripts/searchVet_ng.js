angular.module('searchVet',[]).controller('VetController',function($scope,$http){
	
	//var vetCtrl = this;
	//var vetId = vetCtrl.search.vetId;
	$scope.fireSearch = function(){
		//alert($scope.search.vetId);
		var vetId = $scope.search.vetId;
		//alert('hi');
		$http.post('/api/GetVet'
				,{"vetId":vetId})				
				.success(function(data){ 
				    //resObj = JSON.parse(result);
					//alert(resObj.retCode);		
					$scope.vetData=data;
					console.log(data);
					//alert('yahoo')
				})
				.error(function(data)
						{
						//alert('Not Found!'); 
						});
	}
	
});
		
