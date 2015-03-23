/*global angular */
/*jslint */

var app = angular.module('pkservercraft', ['ngCookies', 'ui.router', 'stormpath', 'stormpath.templates']);

var CONTEXT_ROOT = "/pkservercraft";
var API = CONTEXT_ROOT + "/api/v1";

angular.module('stormpath.CONFIG', []).constant('STORMPATH_CONFIG', {
    AUTHENTICATION_ENDPOINT: CONTEXT_ROOT + '/oauth/token',
    CURRENT_USER_URI: CONTEXT_ROOT + '/users/current',
    USER_COLLECTION_URI: CONTEXT_ROOT + '/users',
    DESTROY_SESSION_ENDPOINT: CONTEXT_ROOT + '/logout',
    RESEND_EMAIL_VERIFICATION_ENDPOINT: CONTEXT_ROOT + '/verificationEmails',
    EMAIL_VERIFICATION_ENDPOINT: CONTEXT_ROOT + '/emailVerificationTokens',
    PASSWORD_RESET_TOKEN_COLLECTION_ENDPOINT: CONTEXT_ROOT + '/passwordResetTokens',
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
            defaultPostLoginState: 'servers'
        });
    }]);

