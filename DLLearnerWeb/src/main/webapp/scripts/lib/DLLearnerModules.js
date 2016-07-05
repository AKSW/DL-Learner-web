var app = angular.module("DLLearnerModules", ["AJAXModule"]);
//UCS only for debug
app.service("ModulesService", ["$log", "AJAXService", "UserComponentsService", function($log, AJAXService, UCS) {

    var Modules = [];
    var Components = [];
    var ajaxFinished = false;
    var subscribers = [];

    var notifySubscribers = function() {
        for (var pos in subscribers) {
            subscribers[pos]({
                modules: Modules,
                components: Components
            });
        }
    }

    //retrieve config possibilities coded as json.
    AJAXService.performAjax("/modules", "GET", "", function(response) {
        $log.debug(response);
        Modules = response.data;

        for (var module in Modules) {
            var curModule = Modules[module];
            for (var comp in curModule.moduleComponents) {
                Components.push(curModule.moduleComponents[comp]);
            }
        }

        // UCS.addComponent(Components[0]);

        ajaxFinished = true;
        notifySubscribers();

    }, function(err) {});

    return {
        getModules: function() {
            return Modules;
        },
        getComponents: function() {
            return Components;
        },
        getData: function(cb) {
            if (ajaxFinished) {
                subscribers.push(cb);
                cb({
                    modules: Modules,
                    components: Components
                });
            } else subscribers.push(cb);
        }
    }

}]);

app.service("UserComponentsService", ["$log", function($log) {

    var selectedComponents = [];
    var subscribers = [];

    var notifySubscribers = function() {

        for (var pos in subscribers) {
            subscribers[pos](selectedComponents);
        }
    };

    return {
        subscribe: function(cb) {
            subscribers.push(cb);
            cb(selectedComponents);
        },
        getSelectedComponents: function() {
            return selectedComponents;
        },
        addComponent: function(component) {

            selectedComponents.push(component);
            notifySubscribers();
        },
        setComponents: function(components) {

            selectedComponents = components;
            notifySubscribers();
        }
    }
}]);

app.directive("dllModules", [function() {

    var controller = ["$log", "$scope", "ModulesService", "UserComponentsService", function($log, $scope, ModulesService, UCS) {

        $scope.Modules = [];
        $scope.Components = [];

        $scope.selectedModule;

        $scope.visible = false;

        $scope.onClickModule = function(module) {

            $scope.selectedModule = module;
        };

        $scope.onClickComponent = function(component) {

            UCS.addComponent(angular.copy(component));
        };


        ModulesService.getData(function(data) {
            $scope.Modules = data.modules;
            $scope.Components = data.components;
        });

        $scope.$on("ToggleModuleView", function(event) {

            $scope.visible = !$scope.visible;
        });
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: "../../views/partials/dll-modules-template.htm",
        controller: controller
    }

}])
