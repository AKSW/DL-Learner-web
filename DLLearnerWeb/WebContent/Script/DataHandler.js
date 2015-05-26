/**
 * 
 */

var loadingState = false;

/**
 * Converts the values of the Configuration and Knowledge Source textareas into a JSON.
 */
function convertFormToJSON() {
	var form = document.getElementById("formHTML");

	var input_config = $('.CodeMirror')[0].CodeMirror.getValue();
	var input_ks = $('.CodeMirror')[1].CodeMirror.getValue();

	var formInput = {};
	formInput["config"] = input_config;
	formInput["ks"] = input_ks;

	var formAsJSON = JSON.stringify(formInput);
	return formAsJSON;
}

/**
 * Is called when clicking on "Submit Configuration" Button in the navigation bar.
 * Will post the forms data coded as JSON to the rest-servers config-url.
 */
function callDLL() {
	//set loading layout to show
	document.getElementById("loading").style.display= 'block';
	loadingState = true;
	repeatAnimation();
	
	var formAsJSON = convertFormToJSON();

	
	$.post("../welcome/config", formAsJSON, function() {
	})
	.done(function(data) {
		//write results into textarea
		document.getElementById("dll_result_area").value = data;
		//set loading layout to hide.
		document.getElementById("loading").style.display = 'none';
		loadingState = false;
	});
}


function repeatAnimation() {
	if(loadingState) {
		$("#loadingText").delay(200).fadeOut('slow').delay(200).fadeIn('slow',repeatAnimation);
	}
}


