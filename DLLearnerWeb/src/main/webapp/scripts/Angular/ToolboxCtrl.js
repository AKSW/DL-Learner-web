angular.module('dllearner_frontend').controller('ToolboxCtrl', function($scope, selectedComponentsService, $log) {

    //Array of selected components. Selection took place in ModuleSelection
    //Array is passed through global service called "selectedComponets"
    //Each time this selectedComponents array gets changed, the ng-repeat in
    //component.htm will react and add the newly added component
    $scope.selectedComponents = selectedComponentsService.getComponents();

    $scope.$watch('selectedComponents', function() {

        if (!$('.CodeMirror')[0].CodeMirror.hasFocus()) {
            //in case selectedComponents were changed from toolbox, update editor.
            $scope.insertSelectionIntoEditor();
        }
    }, true);

    $scope.$on('selectedComponentsChanged', function(event, newComponents) {
        $scope.selectedComponents = newComponents;
        $scope.$apply();
    });

    /**
     * Method provides all options avaiable for a given component.
     */
    $scope.getOptionsByComponent = function(component) {

        return component.componentOptions;
    }

    /**
     * Method gets called, when the input form for a component variable is changed.
     * Input-form is bind via ng-model on the current repeated component.
     * Actually we dont need to assign the new variable value manually. The ng-model directive should do this.
     */
    $scope.componentVariableChanged = function(component) {}

    /**
     * Function gets called when "add" is clicked on options selection.
     * Because the selectedOption-Object is bind by Angular to the current iterated component object,
     * we just need to assign the (new) option value.
     * 
     * Considering the fact, that the options are directly connected to the component, we 
     * dont have to manually check, if the user sets the same option twice. The value will just overwritten.
     * @param: 
     *			selectedOption: 		object from <select> tag.
     *			selectedOptionValue: 	value from input field
     */
    $scope.addOption = function(selectedOption, selectedOptionValue) {

        $log.debug("Adding option");

        //check if field were filled. if not: stop execution.
        if (typeof(selectedOption) === 'undefined' || typeof(selectedOptionValue) === 'undefined') {
            return;
        }

        //adopt selected option object, but extend it by "value" field
        selectedOption.optionValue = selectedOptionValue;
    }

    /**
     * Function gets called when "remove option" is clicked.
     * Given the index of Angulars ng-repeat, we can access the position in optionsList,
     * and set the optionValue field to "undefined". Like a reset.
     */
    $scope.removeOption = function(index, component) {
        var optionsList = $scope.getSelectedOptionsByComponent(component);
        optionsList[index].optionValue = undefined;
    }

    /**
     * Function gets called when "remove component" is clicked.
     * Will delete the selected component in the array of selected components.
     */
    $scope.removeComponent = function(index) {

        $scope.selectedComponents.splice(index, 1);
    };

    /**
     * Function gets called, when Angular tries to ng-repeat over the selected options.
     * Given a component, this function returns all options, that got an optionValue.
     * 
     * @return Array of Options
     */
    $scope.getSelectedOptionsByComponent = function(component) {

        var optionsList = [];

        for (var pos in component.componentOptions) {
            var current = component.componentOptions[pos];

            //check if the optionValue field was never set or was deleted (or technically overwritten with nothing)
            if (typeof(current.optionValue) !== 'undefined') {
                optionsList.push(current);
            }
        }

        return optionsList;
    }

    /* 	############################################################
    	####################	Editor Writing	####################
    	############################################################ */

    $scope.insertSelectionIntoEditor = function() {

        //get CodeMirror instance
        var confEditor = $('.CodeMirror')[0].CodeMirror;
        var content = "";

        //Counting the numbers of lines, that will be added.
        //Important for snychro editor->toolbox
        var lineCount = 0;

        for (var pos in $scope.selectedComponents) {
            //current component
            var component = $scope.selectedComponents[pos];

            //apply the components variable name. If no one was set yet, get the default ones.
            var componentVariable = component.componentVariable;
            if (typeof(componentVariable) === 'undefined' || componentVariable == '') {
                componentVariable = $scope.extractComponentDefaultVariable(component);
            }

            //add the componentVariable and the component usage to the editor
            content += componentVariable + $scope.extractComponentUsage(component) + "\n";
            component.lineOccurrence = lineCount;
            lineCount++;


            //selected options of this component
            var selectedOptions = $scope.getSelectedOptionsByComponent(component);

            for (var posOpt in selectedOptions) {
                var option = selectedOptions[posOpt];

                if (option.optionUsage.indexOf("\"") != -1) {
                    content += componentVariable + "." + option.optionName + " = \"" + option.optionValue + "\"\n";
                } else {
                    content += componentVariable + "." + option.optionName + " = " + option.optionValue + "\n";
                }
                option.lineOccurrence = lineCount;
                lineCount++;
            }

            content += "\n\n";
            lineCount += 2;
        }

        //apply the calculated content to the editor
        confEditor.setValue(content);
    }

    /**
     * Function returns the default variable for a component (e.g. ks)
     */
    $scope.extractComponentDefaultVariable = function(component) {
        var prefix = component.componentUsage.substring(0, component.componentUsage.indexOf("."));
        return prefix;
    }

    /**
     * Function returns the components config-file usage, as documented in the documentation.
     * Without the default prefix.
     */
    $scope.extractComponentUsage = function(component) {
        var componentUsage = component.componentUsage;

        return componentUsage.substring(componentUsage.indexOf("."));
    }
});
