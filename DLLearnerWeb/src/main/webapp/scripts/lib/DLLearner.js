var app = angular.module("DLLearner", ["AJAXModule", "DLLearnerModules"]);
app.service("UserComponentsService", ["$log", function($log) {

    var selectedComponents = [];


    return {
        getSelectedComponents: function() {
            return selectedComponents;
        },
        addComponent: function(component) {
            selectedComponents.push(component);
        },
        setComponents: function(components) {

            selectedComponents = components;
            //sending broadcast, that the components have changed.
            //ToolboxCtrl will react on it.
            //$rootScope.$broadcast('selectedComponentsChanged', components);
        }
    }

}]);
