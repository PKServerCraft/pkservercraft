/*global require, process, console, setInterval, clearInterval */
/*jslint plusplus: true */

var Express = require('express');
var stormpathExpressSdk = require('stormpath-sdk-express');
var serverManager = require('./lib/ServerManager');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var settings = require('./lib/SettingsManager').settings;

var SP_CONFIG = {
    appHref: process.env.STORMPATH_APP_HREF,
    apiKeyId: process.env.STORMPATH_API_KEY_ID,
    apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
    writeAccessTokenResponse: true,
    allowedOrigins: ['http://www-dev.paulkimbrel.com', 'http://localhost:9000'],
    tokenEndpoint: settings.CONTEXT_ROOT + "/oauth/token",
    logoutEndpoint: settings.CONTEXT_ROOT + "/logout",
    userCollectionEndpoint: settings.CONTEXT_ROOT + "/users",
    currentUserEndpoint: settings.CONTEXT_ROOT + "/users/current",
    resendEmailVerificationEndpoint: settings.CONTEXT_ROOT + "/verificationEmails",
    emailVerificationTokenCollectionEndpoint: settings.CONTEXT_ROOT + "/verificationEmails",
    passwordResetTokenCollectionEndpoint: settings.CONTEXT_ROOT + "/passwordResetTokens"
};

function main() {
    "use strict";

    var spMiddleware = stormpathExpressSdk.createMiddleware(SP_CONFIG),
        app = new Express(),
        api_path = settings.CONTEXT_ROOT + settings.API_ROOT;

    app.use(Express["static"](settings.ROOT_DIR));
    app.use(settings.CONTEXT_ROOT, Express['static'](settings.ROOT_DIR));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(settings.CONTEXT_ROOT + '/passwordReset', function (req, res, next) {
        var sptoken = req.query.sptoken;
        res.status(302).set('location', settings.CONTEXT_ROOT + '/#/passwordReset?sptoken=' + sptoken).send();
    });

    spMiddleware.attachDefaults(app);
    app.use(spMiddleware);

    function sendResponse(response, type, message, object) {
        response.set('Content-Type', 'application/json').send(object);
    }

    function sendError(response, error) {
        var status = 500,
            retVal = {
                "type" : "error",
                "message" : error.message
            };
        
        if (error.status !== undefined) {
            status = error.status;
        }

        response.set('Content-Type', 'application/json').status(status).send(retVal);
    }

    app.get(api_path + "/servers", spMiddleware.authenticate, function (request, response) {
        serverManager.listServers().then(function (servers) {
            sendResponse(response, "servers", "success", servers);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.get(api_path + "/servers/:slug", spMiddleware.authenticate, function (request, response) {
        serverManager.findServer(request.param("slug")).then(function (server) {
            sendResponse(response, "server", "success", server);
        }, function (error) {
            sendError(response, error);
        });
    });
    

    app.listen(process.env.PORT || 8080);
}

main();
