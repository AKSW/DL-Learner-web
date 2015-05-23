/**
 * 
 */
function loadFatherExample() {
	// Path to Father.conf Example
	var confFile = "../../Examples/father.conf";

	var configExampleFile = new XMLHttpRequest();
	configExampleFile.open("GET", confFile, false);
	// define method for requesting file. on status change means success or
	// failure
	configExampleFile.onreadystatechange = function() {
		if (configExampleFile.readyState === 4) {
			if (configExampleFile.status === 200 || configExampleFile.status == 0) {
				var allText = configExampleFile.responseText;
				document.forms["formHTML"].getElementsByTagName("textarea")[0].value = allText;
				//notify that the knowledge source type may changed
				updateKnowledgeSource(allText);
			}
		}
	}
	// execute file request
	configExampleFile.send(null);

	var owlFile = "../../Examples/father.owl";

	var owlExampleFile = new XMLHttpRequest();
	owlExampleFile.open("GET", owlFile, false);
	owlExampleFile.onreadystatechange = function() {
		if (owlExampleFile.readyState === 4) {
			if (owlExampleFile.status === 200 || owlExampleFile.status === 0) {
				var allText = owlExampleFile.responseText;
				var elements = document.forms["formHTML"].getElementsByTagName("textarea")[1].value = allText;
			}
		}
	}
	owlExampleFile.send(null);
}