/*global app */
/*jslint */

app.controller('servers', function ($scope, $http) {
    "use strict";

    function refresh() {
        $scope.loading = true;
        $http.get('/pkservercraft/api/v1/servers')
            .success(function (data, status, headers, config) {
                $scope.loading = false;
                $scope.servers = data;
            })
            .error(function (data, status, headers, config) {
                $scope.loading = false;
                //console.log("ERROR: " + data);
            });
    }

    $scope.loading = false;
    $scope.refresh = refresh;

    refresh();
});
