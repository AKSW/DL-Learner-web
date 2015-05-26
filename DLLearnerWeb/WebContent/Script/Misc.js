/**
 * miscellaneous functions
 */

/**
 * Initialize CodeMirror Editor Objects.
 */
function init() {
	var configTextarea = document.getElementById("input_config");
	var codeMirrorConfiguration = CodeMirror(function(elt) {
			configTextarea.parentNode.replaceChild(elt, configTextarea);}, 
	{
		lineNumbers: true, 
		mode: 'javascript',
		scrollbarStyle: 'simple'
	}).on("change", function(cm, change) {
		updateKnowledgeSource(cm.getValue());
	});
	
	var ksTextarea = document.getElementById("input_ks");
	var codeMirrorKS = CodeMirror(function(elt) {
		ksTextarea.parentNode.replaceChild(elt, ksTextarea);
	}, {
		lineNumbers: true, 
		mode: 'xml',
		scrollbarStyle: 'simple'
	});

}

function toggleToolbox() {
	//check if div is 'display: block' -> visible or 'display: none' -> hidden
	var visible = window.getComputedStyle(document.getElementById("toolbox_outer_div")).display;
	//if visible
	if(visible === 'block') {
		//set display to 'none' to hide 
		document.getElementById("toolbox_outer_div").style.display='none';
	} else {
		//set display to 'block' to show
		document.getElementById("toolbox_outer_div").style.display='block';
	}
}

/**
 * Updates the identifier for the knowledge source textarea.
 * Is called each time the knowledge textarea is changed.
 * 
 * @param String Current content of Configuration textarea
 */
function updateKnowledgeSource(confContent) {
	//check for occurences of ks.type
	if(confContent.indexOf("ks.type") != -1) {
		
		//find first quotation mark in ks.type
		var firstQuotationMark = confContent.indexOf("\"", confContent.indexOf("ks.type"));
		//find second quotation mark in ks.type
		var secondQuotationMark = confContent.indexOf("\"", firstQuotationMark+1);
		
		//if ks.type is defined (by using two quotation marks)
		if(firstQuotationMark != -1 && secondQuotationMark != -1) {
			var ks = confContent.substring(firstQuotationMark+1, secondQuotationMark)
			console.log("ks.type: "+ks);
			console.log(document.getElementById("ksName"));
			document.getElementById("ksName").innerHTML = "Knowledge Source: "+ks;
		}
	}
	
	
}