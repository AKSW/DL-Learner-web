var app = angular.module("DLLearner", ["AJAXModule", "dllModules", "dllEditor", "dllToolbox"]);

app.controller("DLLearnerCtrl", ["$rootScope", "$scope", "$log", function($rootScope, $scope, $log) {

    $scope.toggleModuleView = function() {

        $rootScope.$broadcast("ToggleModuleView");
    };

}]);
