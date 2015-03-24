/*global app */
/*jslint */

app.controller('servers', function ($scope, $http) {
    "use strict";

    $http.get('/pkservercraft/api/v1/servers')
        .success(function (data, status, headers, config) {
           $scope.servers = data;
        })
        .error(function (data, status, headers, config) {
            console.log("ERROR: " + data);
        })
});
