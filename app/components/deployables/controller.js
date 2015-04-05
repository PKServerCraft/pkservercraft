/*global app */
/*jslint */

app.controller('deployables', function ($scope, $http) {
    "use strict";
    
    $scope.deployables_tree = [];

    function refresh() {
        var deployableIndex, versionIndex;
        $scope.loading = true;
        $http.get('/pkservercraft/api/v1/deployables')
            .success(function (data, status, headers, config) {
                $scope.loading = false;
                $scope.deployables = data;
                
                $scope.deployables_tree = [];
                for (deployableIndex in data) {
                    $scope.deployables_tree.push({
                        "label": data[deployableIndex].slug,
                        "children": []
                    });
                    for (versionIndex in data[deployableIndex].versions) {
                        $scope.deployables_tree[deployableIndex].children.push({
                            "label": data[deployableIndex].versions[versionIndex].version
                        });
                    }
                }
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
