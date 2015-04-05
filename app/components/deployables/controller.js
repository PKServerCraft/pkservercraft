/*global app */
/*jslint */

app.controller('deployables', function ($scope, $http) {
    "use strict";

    function refresh() {
        $scope.loading = true;
        $http.get('/pkservercraft/api/v1/deployables')
            .success(function (data, status, headers, config) {
                $scope.loading = false;
                $scope.deployables = data;
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
