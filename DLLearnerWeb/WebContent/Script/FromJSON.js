/**
 * 
 */

function convertFormToJSON() {
	var form = document.getElementById("formHTML");

	var input_config = form.elements[0].value;
	var input_owl = form.elements[1].value;

	var formInput = {};
	formInput["config"] = input_config;
	formInput["owl"] = input_owl;

	var formAsJSON = JSON.stringify(formInput);
	return formAsJSON;
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