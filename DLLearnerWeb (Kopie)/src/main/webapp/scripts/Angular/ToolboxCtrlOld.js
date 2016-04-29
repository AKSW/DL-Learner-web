angular.module('dllearner_frontend').controller('ToolboxCtrl', function($scope, selectedComponents, $log) {

	//Array of selected components. Selection took place in ModuleSelection
	//Array is passed through global service called "selectedComponets"
	//Each time this selectedComponents array get changed, the ng-repeat in
	//component.htm will react and add the newly added component
	$scope.selectedComponents = selectedComponents.getComponents();
	
	$scope.$watch('selectedComponents', function() {
		insertOptionsIntoConfiguration();
		$log.debug("$watch on selectedComponents");
	}, true)

	$scope.$watch('componentVariable', function() {
		console.log($scope.componentVariable);
	}, true);

	//Array of selected options.
	$scope.selectedOptions = [];
	
	$scope.$watch('selectedOptions', function() {
		insertOptionsIntoConfiguration();
		$log.debug("$watch on selectedOptions");
	}, true);

	/**
	 * Returns an Array of all Options of a given Component
	 * @param: component object
	 */
	$scope.getAllOptions = function(component) {
		
		return component.componentOptions;
	}

	//in future: disable options already taken
	$scope.getAvaiableOptions = function(component) {

		return $scope.getAllOptions(component);
	};


	
	/**
	 * Function gets called when "add" is clicked on options selection.
	 * @param: 
	 *			selectedOption: 		object from <select> tag. Contains meta data.
	 *			selectedOptionValue: 	value from input field
	 *			componentName: 			name of corresponding component. 
	 */
	$scope.addOption = function(selectedOption, selectedOptionValue, component, selectedComponentVariable){

		//check if field were filled. if not: stop execution.
		if(typeof(selectedOption) === 'undefined' || typeof(selectedOptionValue) === 'undefined') {
			return;
		}
		
		//adopt selected option object, but extend it by "value" field
		selectedOption.optionValue = selectedOptionValue;

		//adopt custom variable, if not null.
		if(typeof(selectedComponentVariable) !== 'undefined') {
			component.componentVariable = selectedComponentVariable;
			$log.debug("variable not null");
		} else {
			$log.debug("variable null");
		}

		//build an object which is able to associate a component name to selected options.
		var object = {
			component: component,
			option: selectedOption
		}

		console.log(object);

		//add option object to selected option
		$scope.selectedOptions.push(object);

		console.log("Adding options belonging to "+component.componentName);
		
	}


	/*
		################################ TO FUCKING DO ######################################
		Removing has some bugs.
	*/

	/**
	 * Function gets called when "Remove Option" is clicked.
	 * @params: 		
	 * 				index: Angular Variable defining index of ng-repeat structure.
	 *				component: component object. Needed to know what options to handle.
	 * 
	 * 
	 */
	$scope.removeOption = function(index, component) {

		//get current selectedOptions array.
		var oldSelectedOptions = $scope.selectedOptions;
		//initialize a new one.
		var newSelectedOptions = [];
		
		//go through all selected options. (Array of Objects)
		for(var pos in oldSelectedOptions) {
			console.log("Pos: "+pos+", Index: "+index);
			var current = oldSelectedOptions[pos];

			//check if the option belongs to the component, that contains an option that 
			//the user wants to delete.
			if(current.componentName === component.componentName) {
				console.log("ComponentNames match. "+current.componentName);

				if(pos != index) {
					newSelectedOptions.push(current);
				} else {
					console.log("Pos "+pos+", Index "+index+" match");
				}
			} else {
				newSelectedOptions.push(current);
			}
		}
		
		//apply the new array.
		$scope.selectedOptions = newSelectedOptions;
	}

	/**
	 *	Function gets called when Angular wants to iterate through all selected options.
	 * 	@params: component object
	 */
	$scope.getSelectedOptions = function(component) {
		//initialize an empty array.
		var optionsArray = [];

		//go through all selected options
		for(var option in $scope.selectedOptions) {
			var selectedOption = $scope.selectedOptions[option];

			//check if the selected options component belonging fits the given component
			if(component.componentName === selectedOption.component.componentName) {
				//add option to array.
				optionsArray.push(selectedOption);
			}
		}
		
		return optionsArray;
	}
	
	/**
	 * 	###################### TO DO ######################
	 *  		Apply new option type to input /default)
	 */
	$scope.onOptionChange = function(selectedOption, $index){
		var optionType = selectedOption.optionType;
		
		switch(optionType) {
			case "String": {
				$scope.selectedOptionType = "text";
				break;
			}
			case "boolean": {
				$scope.selectedOptionType = "checkbox";
				break;
			}
		}
		
	};


	$scope.removeComponent = function(index) {
		$scope.selectedComponents.splice(index, 1);
	};




	/*************************************************************************
								HELPER FUNCTIONS
	 ************************************************************************/

	/**
	 * Function gets called each time the $scope.selectedComponents or $scope.selectedOptions Array changes.
	 * It will parse the selected components/options and paste them into the configuration editor.
	 */
	function insertOptionsIntoConfiguration() {
		//get an object which contains components. each component-key holds an option-array as value.
		var optionsSortedByComponents = sortOptionsByComponents($scope.selectedOptions);
		//get CodeMirror instance
		var confEditor = $('.CodeMirror')[0].CodeMirror;
		var content = "";
		
		//go through all selected components.
		for(var pos in $scope.selectedComponents) {
			var component = $scope.selectedComponents[pos];
			//retrieve all options that belongs to the selected component.
			var componentOptions = optionsSortedByComponents[component.componentName];

			//extract the component prefix. E.g "ks" or "la"
			var componentPrefix = component.componentUsage.substring(0, component.componentUsage.indexOf("."));
			
			//Add component definition to editor content.
			//E.g. "ks.type = "kbfile""
			content += component.componentUsage+"\n";
			
			//go through all options belonging to var "component"
			for(var optionPos in componentOptions) {
				//add an option definition.
				//e.g. "ks.fileName = "baum.kb""
				content += componentPrefix + "." + componentOptions[optionPos].option.optionName + " = \"" + componentOptions[optionPos].option.optionValue + "\"\n";
			}
			
			content += "\n\n";
		}
		
		//apply the calculated content to the editor
		confEditor.setValue(content);
		
	}

	/**
	 * Functions will return an object holding different components.
	 * Each component (as a key) will hold an option array as value.
	 * 
	 * @return optionSortedByComponents Array.
	 */
	function sortOptionsByComponents(selectedOptions) {
		var optionsSortedByComponents = {};
		
		//go through all options
		for(var pos in selectedOptions) {
			var option = selectedOptions[pos];
			
			
			//check if the key, identified by component name, is defined.
			if(typeof optionsSortedByComponents[option.component.componentName] == 'undefined') {
				//if not, create an array as value for this key.
				optionsSortedByComponents[option.component.componentName] = [];
				optionsSortedByComponents[option.component.componentName].push(option);
				
			} else {
				//if, add option to array.
				optionsSortedByComponents[option.component.componentName].push(option);
			}
		}
		
		return optionsSortedByComponents;
	}
});