/*global angular */
/*jslint */

var app = angular.module('pkservercraft', ['ngCookies', 'ui.router', 'stormpath', 'stormpath.templates']);

var API = "http://localhost:8080/pkservercraft/api/v1";

angular.module('stormpath.CONFIG', []).constant('STORMPATH_CONFIG', {
    CURRENT_USER_URI: API + '/users/current',
    USER_COLLECTION_URI: API + '/users',
    DESTROY_SESSION_ENDPOINT: '/logout',
    RESEND_EMAIL_VERIFICATION_ENDPOINT: API + '/verificationEmails',
    EMAIL_VERIFICATION_ENDPOINT: API + '/emailVerificationTokens',
    PASSWORD_RESET_TOKEN_COLLECTION_ENDPOINT: API + '/passwordResetTokens',
    GET_USER_EVENT: '$currentUser',
    SESSION_END_EVENT: '$sessionEnd',
    UNAUTHORIZED_EVENT: 'unauthorized',
    LOGIN_STATE_NAME: 'login',
    FORBIDDEN_STATE_NAME: 'forbidden',
    AUTHENTICATION_SUCCESS_EVENT_NAME: '$authenticated',
    AUTHENTICATION_FAILURE_EVENT_NAME: '$authenticationFailure',
    AUTH_SERVICE_NAME: '$auth',
    NOT_LOGGED_IN_EVENT: '$notLoggedin',
    STATE_CHANGE_UNAUTHENTICATED: '$stateChangeUnauthenticated',
    STATE_CHANGE_UNAUTHORIZED: '$stateChangeUnauthorized'
});

app.run(['$http', '$rootScope', '$stormpath', '$q', 'STORMPATH_CONFIG',
    function ($http, $rootScope, $stormpath, $q, STORMPATH_CONFIG) {
        'use strict';
        $rootScope.navbar = 'app/shared/navbar/view.html';
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'main'
        });
    }]);

