/*global app,console,STORMPATH_CONFIG*/
/*jslint */

app.controller('navbar', function ($scope, $state, STORMPATH_CONFIG) {
    "use strict";

    $scope.$on(STORMPATH_CONFIG.SESSION_END_EVENT, function () {
        $state.go($state.current, {}, {reload: true});
    });
});
