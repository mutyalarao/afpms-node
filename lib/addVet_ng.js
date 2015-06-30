angular.module('AddVet',[]).controller('VetController',function($scope,$http){
	
	$scope.fireSearch = function($scope){
		alert($scope.search.vetId);
	}
})
		
