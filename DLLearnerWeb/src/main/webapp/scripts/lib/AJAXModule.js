var app = angular.module("AJAXModule", []);
app.service("AJAXService", ["$log", "$http", function($log, $http) {


    var requestHost = "/dllearner";

    return {
        performAjax: function(url, method, data, success, error) {
            //The configuration object for angulars $http.
            var config = {
                method: method,
                url: requestHost + url,
                data: data
            };

            var startTime = new Date().getTime();

            $http(config).then(function(response) {
                var endTime = (new Date().getTime() - startTime) / 1000;
                $log.info("[ok]  " + method + "\t" + response.status + "\t\t" + endTime + "s\t" + url);

                success(response);
            }, function(response) {
                //Calling the onError callback
                error(response);
            });
        }
    }

}])
