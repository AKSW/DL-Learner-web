/**
 * miscellaneous functions
 */

function init() {
	// initialize CodeMirror Objects
	initCodeMirror();

	// set line comments for assignment positions
	setupComments();

	// add keydown-event listener
	$("#tb_ks_type").keydown(function(event) {
		if (event.which === 13) {
			writeConfiguration("ks_type", document.getElementById("tb_ks_type").value);
		}
	});
}

function writeConfiguration(element, value) {

	switch (element) {
		case "ks_type": {
			
			var ksContent = getAreaContent("ks");
			
			//if ks.type already mentioned
			if(ksContent.indexOf("ks.type") != -1) {
				var ksTypeIndexBegin = ksContent.indexOf("ks.type");
				var ksTypeIndexEnd = ksContent.indexOf("\n", ksTypeIndexBegin);
				
				var ksContentBefore = ksContent.substring(0, ksTypeIndexBegin);
				var ksContentAfter = ksContent.substring(ksTypeIndexEnd);
				
				ksContent = ksContentBefore + "ks.type = \""+value+"\"" + ksContentAfter;
				setAreaContent("ks", ksContent);
			} //else add new property 
			else {
				var ksContent = getAreaContent("ks");
				
				var insertStart = ksContent.indexOf("// knowledge source definition")+"// knowledge source definition".length;
				var before = ksContent.substring(0, insertStart);
				var after = ksContent.substring(insertStart+1);
				
				console.log(before+"\nks.type = \""+value+"\""+after);
				setAreaContent("ks",before + "\nks.type = \""+value+"\"\n" + after);
			}
		}
	}
}

function setAreaContent(areaName, newContent) {
	// retrieve the ConfigurationEditor-CodeMirror Object
	var cmConfigurationEditor = $('.CodeMirror')[0].CodeMirror;
	
	switch(areaName) {
		case "ks": {
			var content = cmConfigurationEditor.getValue();
			var beforeKS = content.substring(0, content.indexOf("// knowledge source definition")-1);
			var afterKS = content.substring(content.indexOf("// reasoner"));
		
			cmConfigurationEditor.setValue(beforeKS+"\n" + newContent+"\n" + afterKS);
		}
	}
}

function getAreaContent(areaName) {
	
	// retrieve the ConfigurationEditor-CodeMirror Object
	var cmConfigurationEditor = $('.CodeMirror')[0].CodeMirror;
	
	switch(areaName) {
		case "ks": {
			
			var fullContent = cmConfigurationEditor.getValue();
			var ksStart = fullContent.indexOf("// knowledge source definition");
			var ksEnd = fullContent.indexOf("// reasoner")-1;
			
			return fullContent.substring(ksStart, ksEnd);
		}
	}
}


/**
 * Setup line comments who indicates a position for a specifc assignment
 */
function setupComments() {
	// retrieve COnfigurationEditor-CodeMirror Object
	var cmConfigurationEditor = $(".CodeMirror")[0].CodeMirror;

	// prefixes
	var content = "// declare some prefixes to use as abbreviations\n\n\n";
	// ks
	content += "// knowledge source definition\n\n\n";
	// reasoner
	content += "// reasoner\n\n\n";
	// learning problem
	content += "// learning problem\n\n\n";
	// refinement operator
	content += "// create a refinement operator and configure it\n\n\n";
	// heuristic
	content += "// create a heuristic and configure it\n\n\n";
	// learning algorithm
	content += "// create learning algorithm to run\n\n\n";

	cmConfigurationEditor.setValue(content);
}

/**
 * Initialize CodeMirror Editor Objects.
 */
function initCodeMirror() {
	// get textarea for configurations
	var configTextarea = document.getElementById("input_config");
	// CodeMirror Instance. Plain HTML-Textarea will be replaced
	var codeMirrorConfiguration = CodeMirror(function(elt) {
		configTextarea.parentNode.replaceChild(elt, configTextarea);
	}, {
		// show linenumbers
		lineNumbers : true,
		// syntax mode: JavaScript (for now)
		mode : 'javascript',
		// ScrollbarStyle (refers to script 'simplescrollbars.js' and
		// 'simplescrollbars.css')
		scrollbarStyle : 'simple'
	// add a change-listener
	}).on("change", function(cm, change) {
		// pass CodeMirror-Values to Knowledge-Source update function
		updateKnowledgeSource(cm.getValue());
	});

	// get textarea for knowledge source
	var ksTextarea = document.getElementById("input_ks");
	// CodeMirror Instance. Plain HTML-Textarea will be replaced
	var codeMirrorKS = CodeMirror(function(elt) {
		ksTextarea.parentNode.replaceChild(elt, ksTextarea);
	}, {
		// show linenumbers
		lineNumbers : true,
		// syntax mode: XML (for now)
		mode : 'xml',
		// ScrollbarStyle (refers to script 'simplescrollbars.js' and
		// 'simplescrollbars.css')
		scrollbarStyle : 'simple'
	});

}

/**
 * A button click in the navigation bar toggles the visiblity of the toolbox
 */
function toggleToolbox() {

	// check if div is 'display: block' -> visible or 'display: none' -> hidden
	var visible = window.getComputedStyle(document.getElementById("toolbox_outer_div")).display;

	// if visible
	if (visible === 'block') {
		// set display to 'none' to hide
		// document.getElementById("toolbox_outer_div").style.display = 'none';
		$("#toolbox_outer_div").hide(500);
	} else {
		// set display to 'block' to show
		// document.getElementById("toolbox_outer_div").style.display = 'block';
		$("#toolbox_outer_div").show(500);
	}
}

/**
 * Updates the identifier for the knowledge source textarea. Is called each time
 * the knowledge textarea is changed.
 * 
 * @param String
 *            Current content of Configuration textarea
 */
function updateKnowledgeSource(confContent) {
	// check for occurences of ks.type
	if (confContent.indexOf("ks.type") != -1) {

		// find first quotation mark in ks.type
		var firstQuotationMark = confContent.indexOf("\"", confContent.indexOf("ks.type"));
		// find second quotation mark in ks.type
		var secondQuotationMark = confContent.indexOf("\"", firstQuotationMark + 1);

		// if ks.type is defined (by using two quotation marks)
		if (firstQuotationMark != -1 && secondQuotationMark != -1) {
			// get kontent between quotation marks
			var ks = confContent.substring(firstQuotationMark + 1, secondQuotationMark)
			// Set Headline for Knowledge Source Editor
			document.getElementById("ksName").innerHTML = "Knowledge Source: " + ks;
		}
	}
}

/**
 * When clicked on the cross at "Prefix definition" in the toolbar,
 * a "popup" appears, where you can manage your prefixes.
 * 
 * This functions toggles the screen-filling div with acts as this popup.
 */
function togglePrefixView() {
	var visible = window.getComputedStyle(document.getElementById("prefixes_view_canvas")).display;
	
	if(visible === 'block') {
		$("#prefixes_view_canvas").hide(300);
	} else {
		$("#prefixes_view_canvas").show(500);
	}
}

/**
 * Function gets called when the Add-Button in the prefix view is clicked.
 * It extracts the Abreviation and the Value out of the input fields and inserts them
 * into the table
 */
function addPrefix() {
	var abreviation = document.getElementById("prefix_abreviation").value;
	var value = document.getElementById("prefix_value").value;
	
	//retrieve table
	var prefixesTable = document.getElementById("prefixes_table");
	//add new row at last position
	var newRow = prefixesTable.insertRow(-1);
	
	var abreviationCell = newRow.insertCell(0);
	var valueCell = newRow.insertCell(1);
	var removeCell = newRow.insertCell(2);
	
	abreviationCell.innerHTML = abreviation;
	valueCell.innerHTML = value;
	removeCell.innerHTML = "<div id=\"minus\" onClick=\"removePrefix(this)\"></div>";
}


function removePrefix(context){
	//get row index by accessing the divs (the minus) parent (a <td> object), and the parent
	//of the <td> object (a desired <tr> object)
	var rowIndex = context.parentNode.parentNode.rowIndex;
	
	//get prefixes management table
	var prefixesTable = document.getElementById("prefixes_table");
	
	//remove row
	prefixesTable.deleteRow(rowIndex);
	
}









