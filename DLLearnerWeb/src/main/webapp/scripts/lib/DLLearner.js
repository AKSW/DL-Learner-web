var app = angular.module("DLLearner", ["AJAXModule", "DLLearnerModules", "DLLearnerEditor"]);

app.controller("DLLearnerCtrl", ["$rootScope", "$scope", "$log", function($rootScope, $scope, $log) {

    $scope.toggleModuleView = function() {

        $rootScope.$broadcast("ToggleModuleView");
    };

}]);
