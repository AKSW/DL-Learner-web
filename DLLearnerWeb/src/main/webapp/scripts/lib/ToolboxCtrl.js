var app = angular.module("DLLearner");
app.controller("ToolboxCtrl", ["$scope", "$log", "UserComponentsService", function($scope, $log, UCS) {

    $log.info("ToolboxCtrl init");
    $scope.selectedComponents = UCS.getSelectedComponents();

}]);
