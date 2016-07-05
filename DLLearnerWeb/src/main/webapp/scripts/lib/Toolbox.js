var app = angular.module("DLLearner");

app.directive("dllToolbox", [function() {

    var controller = ["$scope", "$log", "UserComponentsService", function($scope, $log, UCS) {

        //Array of components the user selcted
        $scope.selectedComponents = UCS.getSelectedComponents();

        $scope.addOption = function(option, value) {

            if (!option) return;

            if (!value) {
                if (option.optionDefaultValue) option.optionValue = option.optionDefaultValue;
                else return;
            } else {
                option.optionValue = value;
            }
        };

        $scope.getOptions = function(component) {

            var out = [];
            for (var pos in component.componentOptions) {
                var cur = component.componentOptions[pos];

                if (cur.optionValue !== undefined) out.push(cur);
            }

            return out;
        };

        /**
         * Function returns the components config-file usage, as documented in the documentation.
         * Without the default prefix.
         */
        var extractComponentUsage = function(component) {
            var componentUsage = component.componentUsage;

            return componentUsage.substring(componentUsage.indexOf("."));
        };

        /**
         * Function returns the default variable for a component (e.g. ks)
         */
        var extractComponentDefaultVariable = function(component) {
            var prefix = component.componentUsage.substring(0, component.componentUsage.indexOf("."));
            return prefix;
        };

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
                    componentVariable = extractComponentDefaultVariable(component);
                }

                //add the componentVariable and the component usage to the editor
                content += componentVariable + extractComponentUsage(component) + "\n";
                component.lineOccurrence = lineCount;
                lineCount++;


                //selected options of this component
                var selectedOptions = $scope.getOptions(component);

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
        };

        $scope.$watch('selectedComponents', function() {

            if ($('.CodeMirror')[0] && !$('.CodeMirror')[0].CodeMirror.hasFocus()) {

                //in case selectedComponents were changed from toolbox, update editor.
                $scope.insertSelectionIntoEditor();
            }
        }, true);
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../../views/partials/dll-components-template.htm',
        controller: controller
    }

}]);
