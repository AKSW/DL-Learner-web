angular.module('dllearner_frontend').controller('ModuleSelectionCtrl', 
	function($scope, $http, $log, selectedComponents, ComponentFactory, ComponentOptionsFactory) {

	testStuff(selectedComponents, ComponentFactory, ComponentOptionsFactory);

	$scope.selectedModule = "";

	//retrieve config possibilities coded as json.
	//set it in scope.
	$http.get("../rest/modules").success(function(data) {
		$scope.modules = data;
		
	});

	//toggle view of module canvas
	$scope.toggleModuleView = function() {
		toggleModuleView();
	}

	//handle a click on a module
	$scope.handleModuleSelection = function(module) {
		$scope.components = module.moduleComponents;
		$scope.selectedModule = module;
	}

	//handle a click on a component
	$scope.handleComponentSelection = function(component) {
		//here we have to copy (not refer) the component object.
		//later on, the user can add option values.
		//By leaving the component as refered object, the added values will apply
		//on a later added component, which is the same as the previously added.
		//Obj 1 type A gets a value.
		//User adds Obj 2 type A, Obj 2 has the same values Obj 1 got. This should be prohibited.
		var copyComponent = angular.copy(component);
		selectedComponents.addComponent(copyComponent);
	}

});

var configurationModel;

function testStuff(selectedComponents, ComponentFactory, ComponentOptionsFactory) {
	var components = [];

	var object = {
		componentName: "KB File (org.dllearner.kb.KBFile) v0.8",
		componentUsage: "ks.type = \"kbfile\"",
		componentOptions: [{
			optionName: "fileName",
			optionDescription: "relative or absolute path to KB file",
			optionType: "String",
			optionRequired: "false",
			optionDefault: "", 
			optionUsage: "ks.fileName = \"\""
		}, {
			optionName: "url",
			optionDescription: "URL pointer to the KB file",
			optionType: "boolean",
			optionRequired: "false",
			optionDefault: "", 
			optionUsage: "ks.url = \"\""
		}]
	};

	selectedComponents.addComponent(object);

}

/**
 * Returns an Array of Components related to the currently selected module
 * 
 * @param moduleName
 * @returns
 */
function getComponents(moduleName) {
	// go through all modules
	for (var position in configurationModel) {
		// if we reach the current selected module, return the component-array
		if (configurationModel[position].moduleName === moduleName) {
			return configurationModel[position].moduleComponents;
		}
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
