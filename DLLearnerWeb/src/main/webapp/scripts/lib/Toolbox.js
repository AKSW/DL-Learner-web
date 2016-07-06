var app = angular.module("DLLearner");

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
         * @param {Object}                  option      Option-Object from ng-options (<select>)
         * @param {string|number|boolean}   optionValue Value the option should have. 
         */
        $scope.addOption = function(option, optionValue) {

        };
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../../views/partials/dll-components-template.htm',
        controller: controller
    }

}]);
