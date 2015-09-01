/**
 * 
 */


var sheetDir = "../style/";
var sheets = [ 
	"main.css", 
    "main_navigation_bar.css", 
    "areas.css", 
    "toolbox.css", 
    "misc.css",
    "ModuleCanvas.css",
    "component_template.css",
    "tabs.css"
];


for(var sheet in sheets) {
	var s = document.createElement("link");
	s.rel = "stylesheet";
	s.href = sheetDir + sheets[sheet];
	document.head.appendChild(s);
} 