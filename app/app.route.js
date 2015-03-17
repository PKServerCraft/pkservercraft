/*global app */
/*jslint */

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("servers", {
                url: "/",
                templateUrl: "app/components/servers/view.html",
                controller: "servers",
                authenticate: true
            }
        );

        $urlRouterProvider.otherwise("/");
    }
]);
