/**
 * 
 */
angular.module('dllearner_frontend').controller('TabCtrl', function($scope) {
	
	//initializeDropField();
	
	$scope.activeTab = 0;
	
	$scope.tabs = ["Configuration", "Knowledge Source", "Result", "Error"];
	
	$scope.toggleTab = function(index) {
		$scope.activeTab = index;
		console.log(typeof index);
		console.log("Active Tab: "+$scope.activeTab);
	}
	
});

function initializeDropField() {
	var dropDiv = $("#configurationDrop");
	dropDiv.on('dragenter', function(event) {
		event.stopPropagation();
		event.preventDefault();
		$(this).css('border', '10px solid #000');
	});
	
	dropDiv.on('dragover', function(event) {
		event.stopPropagation();
		event.preventDefault();
	});
	
	dropDiv.on('drop', function(event) {
		event.preventDefault();
		$(this).css('border', '10px solid red');
		
		var file = event.originalEvent.dateTransfer.files;
		
		console.log("File:");
		console.log(file);
		
	});
}