/**
 * 
 */

/**
 * Converts the values of the Configuration and Knowledge Source textareas into a JSON.
 */
function convertFormToJSON() {
	var form = document.getElementById("formHTML");

	var input_config = form.elements[0].value;
	var input_ks = form.elements[1].value;

	var formInput = {};
	formInput["config"] = input_config;
	formInput["ks"] = input_ks;

	var formAsJSON = JSON.stringify(formInput);
	return formAsJSON;
}


function callDLL() {
	var formAsJSON = convertFormToJSON();
	console.log(formAsJSON);
	
	$.post("../welcome/config", formAsJSON)
	.done(function(data) {
		document.getElementById("dll_result_area").value = data;
	});
}

function loading() {
	var square = new Sonic({
	    width: 100,
	    height: 100,
	    fillColor: '#000',
	    path: [
	        ['line', 10, 10, 90, 10],
	        ['line', 90, 10, 90, 90],
	        ['line', 90, 90, 10, 90],
	        ['line', 10, 90, 10, 10]
	    ]
	});

	square.play();

	document.body.appendChild(square.canvas);
}

function callConfigPage() {
	var formAsJSON = convertFormToJSON();
	console.log(formAsJSON);
	
	
	post(formAsJSON);

}

function post(params) {
	
	
	var inputElement = document.getElementById("configInput");
	inputElement.setAttribute("value", params);
	var hiddenForm = document.getElementById("hiddenForm");
	console.log(hiddenForm);
	
	hiddenForm.submit();
}