/*global require, process, console, setInterval, clearInterval */
/*jslint plusplus: true */

var Express = require('express');
var stormpathExpressSdk = require('stormpath-sdk-express');
var serverManager = require('./lib/ServerManager');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

//Constants
var ROOT_DIR = process.env.ROOT_DIR;

var CONTEXT_ROOT = process.env.CONTEXT_ROOT || "/pkservercraft";
var API_ROOT = CONTEXT_ROOT + "/api/v1";

var SP_CONFIG = {
    appHref: process.env.STORMPATH_APP_HREF,
    apiKeyId: process.env.STORMPATH_API_KEY_ID,
    apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
    writeAccessTokenResponse: true,
    allowedOrigins: ['http://www-dev.paulkimbrel.com'],
    tokenEndpoint: CONTEXT_ROOT + "/oauth/token",
    logoutEndpoint: CONTEXT_ROOT + "/logout",
    userCollectionEndpoint: CONTEXT_ROOT + "/users",
    currentUserEndpoint: CONTEXT_ROOT + "/users/current",
    resendEmailVerificationEndpoint: CONTEXT_ROOT + "/verificationEmails",
    emailVerificationTokenCollectionEndpoint: CONTEXT_ROOT + "/verificationEmails",
    passwordResetTokenCollectionEndpoint: CONTEXT_ROOT + "/passwordResetTokens"
};

function main() {
    "use strict";

    var spMiddleware = stormpathExpressSdk.createMiddleware(SP_CONFIG),
        app = new Express();

    app.use(Express["static"](ROOT_DIR));
    app.use(CONTEXT_ROOT, Express['static'](ROOT_DIR));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(spMiddleware);
    spMiddleware.attachDefaults(app);

    function sendResponse(response, type, message, object) {
        response.set('Content-Type', 'application/json').send(object);
    }

    function sendError(response, error) {
        var retVal = {
            "type" : "error",
            "message" : error.message
        };

        response.set('Content-Type', 'application/json').status(500).send(retVal);
    }

    app.get(API_ROOT + "/servers", spMiddleware.authenticate, function (request, response) {
        serverManager.listServers().then(function (servers) {
            sendResponse(response, "servers", "success", servers);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.get(API_ROOT + "/servers/:slug", spMiddleware.authenticate, function (request, response) {
        serverManager.findServer(request.param("slug")).then(function (server) {
            sendResponse(response, "server", "success", server);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.listen(process.env.PORT || 8080);
}

main();
