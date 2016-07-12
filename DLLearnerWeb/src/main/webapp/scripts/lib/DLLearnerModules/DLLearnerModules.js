var app = angular.module("dllModules", ["AJAXModule"]);
//UCS only for debug
app.service("ModulesService", ["$log", "AJAXService", function($log, AJAXService) {

    /*
        A list of avaiable modules.
     */
    var Modules = [];

    /*
        A list of avaiable components.
     */
    var Components = [];

    /*
        Inidicator if the request for avaiable modules has finished yet. Used for 'getModules'
     */
    var ajaxFinished = false;

    /*
        A list of callbacks to be executed when the request has finished.
     */
    var callbackQueue = [];

    /**
     * This function will executed every saved callback function,
     * with the avaiable Modules and Components as parameter.
     */
    var processQueue = function() {
        for (var pos in callbackQueue) {
            callbackQueue[pos]({
                modules: Modules,
                components: Components
            });
        }
    };


    /**
     * This function will return the default variable name for a given component.
     * 
     * @param  {Object} component   A component object.
     * 
     * @return {String}             The default variable name for the component
     */
    var getComponentsDefaultVariable = function(component) {
        var usage = component.componentUsage;
        var variable = usage.substring(0, usage.indexOf("."));
        return variable;
    };


    // Deprecated once the backend parsing is better
    var getComponentsShortName = function(component) {
        var componentUsage = component.componentUsage;
        var firstQuotation = componentUsage.indexOf("\"");
        var secondQuotation = componentUsage.indexOf("\"", firstQuotation + 1);

        var typeDeclaration = componentUsage.substring(firstQuotation + 1, secondQuotation);

        return typeDeclaration;
    };


    /*
        Execute an AJAX to retrieve the avaiable modules.
        Here each module and each component will get an ID.
     */
    AJAXService.performAjax("/modules", "GET", "", function(response) {

        // IDs for modules and components.
        var moduleID = 1;
        var componentID = 1;

        for (var module in response.data) {
            var curModule = response.data[module];
            curModule.id = moduleID;

            for (var comp in curModule.moduleComponents) {
                var curComp = curModule.moduleComponents[comp];
                curComp.id = componentID;
                curComp.moduleID = moduleID;
                curComp.componentVariable = getComponentsDefaultVariable(curComp);
                // TODO: This should not be necessary when the backend parsing is more advanced. 
                curComp.shortName = getComponentsShortName(curComp);

                Components.push(curModule.moduleComponents[comp]);
                componentID++;
            }

            moduleID++;
        }

        Modules = response.data;
        $log.debug(Modules);

        ajaxFinished = true;
        processQueue();

    }, function(err) {});

    return {
        getData: function(callback) {
            if (ajaxFinished) callback({
                modules: Modules,
                components: components
            });
            else callbackQueue.push(callback);
        }
    };

}]);

/**
 * This service manages the user's selection of components. 
 * Contrary to the dllToolbox-Ctrl, this service acts as the overarching instance for other controllers and services.
 * 
 * @return {function}   onNewComponent      Subscriber-Function for instances that want to be notified, 
 *                                          when a new component was added.
 *                                          
 * @return {function}   onNewComponents     Subscriber-Function for instances that want to be notified, 
 *                                          when the whole component selection was chagned.  
 *
 * @return {function}   addComponent        A function that adds a given component to the internal list of selected components.
 *
 * @return {function}   removeComponent     A function that removes a given component from the internal list of selected components.
 */
app.service("UserComponentsService", ["$log", function($log) {

    /*
        A list of components the user has selected.
     */
    var selectedComponents = [];

    /*
        A list of callbacks that should be executed once a whole new component selection is made.
        E.g: Loading an example
     */
    var onNewComponentsSubscribers = [];

    /*
        A list of callbacks that should be executed once a new component was added.
     */
    var onNewComponentSubscribers = [];


    /**
     * This function executes all saved callbacks for the 'new component added even'.
     * The argument of these callbacks is the newly added component.
     * @param  {Object} newComponent A component object.
     */
    var notifyNewComponentSubscribers = function(newComponent) {
        for (var pos in onNewComponentSubscribers) {
            onNewComponentSubscribers[pos](newComponent);
        }
    };

    var notifyNewComponentsSubscribers = function() {
        for (var pos in onNewComponentsSubscribers) {
            onNewComponentsSubscribers[pos](angular.copy(selectedComponents));
        }
    };

    return {
        /**
         * Subscriber function for callbacks on new component added.
         * 
         * @param  {Function} callback Function to be executed when a new component was added.
         */
        onNewComponent: function(callback) {

            onNewComponentSubscribers.push(callback);
        },
        /**
         * Subscriber function for callbacks on whole new component selection.
         * 
         * @param  {Function} callback Function to be executed when a whole new component selection was made.
         */
        onNewComponents: function(callback) {

            onNewComponentsSubscribers.push(callback);
        },
        /**
         * This function gets called, when the user clicks on a component in Module-View.
         * All subscribers for new-component-event will be notified.
         * 
         * @param {Object} component A component object
         */
        addComponent: function(component) {
            selectedComponents.push(component);
            notifyNewComponentSubscribers(component);
        },
        /**
         * This function gets called, when the user removes a component from the toolbox.
         * 
         * @param  {Object} component A component object
         */
        removeComponent: function(component) {
            var componentIndex;
            for (var pos in selectedComponents) {
                if (selectedComponents[pos].id == component.id) componentIndex = pos;
            }
            if (componentIndex) selectedComponents.splice(componentIndex, 1);
        },
        /**
         * This function will overwrite the current selected components with 
         * another list of components. Subscribers for "NewComponents" will be notified.
         * 
         * @param {Array} components    A list of component objects.
         */
        setComponents: function(components) {
            $log.debug(JSON.stringify(components));
            $log.debug(JSON.stringify(selectedComponents));
            // When the list of components has not changed, dont start the callback chain.
            // DLLearnerEditor parses a configuration, notifies UCS about the new components,
            // UCS notifies DLLearnerEditor about new components, DLLearnerEditor parses new components,
            // DLLearnerEditor changes CodeMirror-Content, DLLearner gets triggered and parses the configuration.
            if (JSON.stringify(components) === JSON.stringify(selectedComponents)) {
                $log.debug("UCS wont notify newComponents subscribers, because there is no real change");
                return;
            }

            selectedComponents = components;
            notifyNewComponentsSubscribers();
        }
    };
}]);

/**
 * This directive shows the user a collection of modules and corresponding components as a page filling overlay.
 * The user is able to selected a component and add it to his/hers toolbar.
 */
app.directive("dllModules", [function() {

    var controller = ["$log", "$scope", "ModulesService", "UserComponentsService", function($log, $scope, ModulesService, UCS) {

        /*
            A list of avaiable modules.
         */
        $scope.Modules = [];

        /*
            A local, temporary variable that states which components of a module to show.
         */
        $scope.selectedModule = null;

        /*
            A variable indicating if the overlay should be visible or not.
         */
        $scope.visible = false;


        /**
         * Function will set the current module of which the shown components depend.
         * @param  {Object} module  A module object.
         */
        $scope.onClickModule = function(module) {

            $scope.selectedModule = module;
        };

        /**
         * Function will add the component to the list of user-selected components in 'UserComponentsService'.
         * @param  {Object} component A component object.
         */
        $scope.onClickComponent = function(component) {

            UCS.addComponent(angular.copy(component));
        };

        /**
         * Register a callback to get executed when the module-data from the backend has arrived.
         */
        ModulesService.getData(function(data) {

            $scope.Modules = data.modules;
        });

        /**
         * Register a broadcast listener for the 'ToggleModuleView' broadcast.
         * Will switch the visible state of the overlay.
         */
        $scope.$on("ToggleModuleView", function(event) {

            $scope.visible = !$scope.visible;
        });
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: "../scripts/lib/DLLearnerModules/dll-modules-template.htm",
        controller: controller
    };

}]);
