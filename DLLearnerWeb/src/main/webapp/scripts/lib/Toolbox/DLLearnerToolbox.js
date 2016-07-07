var app = angular.module("dllToolbox", ["dllModules"]);

/**
 * This directive handles the made component selection and supports the addition of options for each component.
 */
app.directive("dllToolbox", [function() {

    var controller = ["$scope", "$log", "UserComponentsService", function($scope, $log, UCS) {

        /*
            This array holds the current selection of components.
         */
        $scope.selectedComponents = [];

        /**
         * When the user selects a component from the module selection,
         * the UserComponentService (UCS) gets notified. The UCS therefor 
         * notifies the dllToolbox controller, that there exists a new component
         * in the user's selection.
         */
        UCS.onNewComponent(function(component) {

            $scope.selectedComponents.push(component);
        });

        /**
         * When the user wants to load an example, multiple components
         * are part of it. Instead of notifiying this controller n times for n components
         * in the example, this controller has a callback for a complete new selection of
         * components.
         * 
         * @param  {Array}  components  A list of component objects. 
         */
        UCS.onNewComponents(function(components) {

            $log.debug("Toolbox setting components:");
            $log.debug(components);
            $scope.selectedComponents = components;
        });


        /**
         * Function for removal of a component.
         * Gets called when the user clicks on 'remove component'.
         * 
         * @param  {object} component A component repeated by ng-repeat.
         * @param  {number} index     The index of this component.
         */
        $scope.removeComponent = function(component, index) {

            $scope.selectedComponents.splice(index, 1);
            UCS.removeComponent(component);
        };

        /**
         * Function for addition of an option value / parameter.
         * Gets called when the user clicks on 'add option'.   
         *  
         * @param {Object}                  option      Option-Object from ng-options (<select>)
         * @param {string|number|boolean}   optionValue Value the option should have. 
         */
        $scope.addOption = function(option, optionValue) {

            // If the user entered an optionValue, we'll apply it.
            if (optionValue) {
                option.optionValue = optionValue;
            } else if (option.optionDefaultValue) {
                // If the user has not entered an optionValue, we try to use the default value instead.
                // But if the defaultValue is not set either, the option will not be added.
                option.optionValue = option.optionDefaultValue;
            }

        };
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../../scripts/lib/Toolbox/dll-components-template.htm',
        controller: controller
    };

}]);

app.filter("compOptionFilter", [function() {

    return function(input) {

        var out = [];
        for (var pos in input) {
            if (input[pos].optionValue) out.push(input[pos]);
        }

        return out;
    };

}]);
