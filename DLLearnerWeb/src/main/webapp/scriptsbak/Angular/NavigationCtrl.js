/**
 * 
 */
angular.module('dllearner_frontend').controller('NavigationCtrl', function($scope) {
	$scope.toggleToolbox = function() {
		toggleToolbox();

	}
	$scope.toggleModuleView = function() {
		toggleModuleView();
	}
	$scope.loadFatherExample = function() {
		console.log("toggle father example");
	}
});

function toggleToolbox() {

	// check if div is 'display: block' -> visible or 'display: none' -> hidden
	var visible = window.getComputedStyle(document.getElementById("toolbox_outer_div")).display;

	// if visible
	if (visible === 'block') {
		// set display to 'none' to hide
		// document.getElementById("toolbox_outer_div").style.display = 'none';
		$("#toolbox_outer_div").hide(200);
	} else {
		// set display to 'block' to show
		// document.getElementById("toolbox_outer_div").style.display = 'block';
		$("#toolbox_outer_div").show(200);
	}
}

function toggleModuleView() {
	var visible = window.getComputedStyle(document.getElementById("module_canvas")).display;

	if (visible === 'block') {
		$('#module_canvas').hide(500);
	} else {
		$('#module_canvas').show(500);
	}
}