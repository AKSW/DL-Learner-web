var app = angular.module("DLLearnerModules", ["AJAXModule"]);
app.service("ModulesService", ["$log", "AJAXService", function($log, AJAXService) {

    var Modules = [];
    var Components = [];
    var ajaxFinished = [];
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

app.directive("dllModules", [function() {

    var controller = ["$log", "$scope", "ModulesService", function($log, $scope, ModulesService) {

        $scope.Modules = [];
        $scope.Components = [];

        $scope.selectedModule;

        $scope.onClickModule = function(module) {
            $scope.selectedModule = module;
        };


        ModulesService.getData(function(data) {
            $scope.Modules = data.modules;
            $scope.Components = data.components;
        });
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: "../../views/partials/dll-modules-template.htm",
        controller: controller
    }

}])
