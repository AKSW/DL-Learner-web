/**
 * 
 */
function loadFatherExample() {
	// Path to Father.conf Example
	var confFile = "../../Examples/father.conf";

	//retrieve the ConfigurationEditor-CodeMirror Object
	var cmConfigurationEditor = $('.CodeMirror')[0].CodeMirror;
	
	var configExampleFile = new XMLHttpRequest();
	configExampleFile.open("GET", confFile, false);
	// define method for requesting file. on status change means success or
	// failure
	configExampleFile.onreadystatechange = function() {
		if (configExampleFile.readyState === 4) {
			if (configExampleFile.status === 200 || configExampleFile.status == 0) {
				//now, set the read content as value for the textfields / editors
				
				var allText = configExampleFile.responseText;
				//old way with default html textareas
				//document.forms["formHTML"].getElementsByTagName("textarea")[0].value = allText;
				
				//new fancy way with CodeMirror Editors
				cmConfigurationEditor.setValue(allText);
				//notify that the knowledge source type may changed
				updateKnowledgeSource(allText);
			}
		}
	}
	// execute file request
	configExampleFile.send(null);

	var owlFile = "../../Examples/father.owl";

	var cmKSEditor = $('.CodeMirror')[1].CodeMirror;
	
	var owlExampleFile = new XMLHttpRequest();
	owlExampleFile.open("GET", owlFile, false);
	owlExampleFile.onreadystatechange = function() {
		if (owlExampleFile.readyState === 4) {
			if (owlExampleFile.status === 200 || owlExampleFile.status === 0) {
				var allText = owlExampleFile.responseText;
				//var elements = document.forms["formHTML"].getElementsByTagName("textarea")[1].value = allText;
				cmKSEditor.setValue(allText);
			}
		}
	}
	owlExampleFile.send(null);
}