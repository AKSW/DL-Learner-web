angular.module('dllearner_frontend').controller('AreaCtrl', function($scope) {
		initializeCodeMirror();
		initializeDropArea();

});

function initializeCodeMirror() {
	// get textarea for configurations
	var configTextarea = document.getElementById("config_textarea");
	// CodeMirror Instance. Plain HTML-Textarea will be replaced
	var codeMirrorConfiguration = CodeMirror(function(elt) {
		configTextarea.parentNode.replaceChild(elt, configTextarea);
	}, {
		// show linenumbers
		lineNumbers : true,
		// syntax mode: JavaScript (for now)
		mode : 'ebnf',
		// ScrollbarStyle (refers to script 'simplescrollbars.js' and
		// 'simplescrollbars.css')
		scrollbarStyle : 'simple',
		//prevent CodeMirrors default Drop-Actions
		dragDrop: false
	});
}

function initializeDropArea() {
	$("#configurationDrop").on("drop", function(event) {
		event.preventDefault();
		event.stopPropagation();
		console.log("drop");
	});
	
	$("#configurationDrop").on("dragover", function(event) {
		console.log("dragover");
	});
}