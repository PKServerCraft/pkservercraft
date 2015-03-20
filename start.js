/*global require, process, console, setInterval, clearInterval */
/*jslint plusplus: true */

var Express = require('express');
var stormpath = require('express-stormpath');
var cors = require('cors');
var serverManager = require('./lib/ServerManager');

//Constants
var ROOT_DIR = process.env.ROOT_DIR;

var CONTEXT_ROOT = process.env.CONTEXT_ROOT || "/pkservercraft";
var API_ROOT = CONTEXT_ROOT + "/api/v1";

function main() {
    "use strict";

    var app = new Express();
    console.log(CONTEXT_ROOT);
    app.use(CONTEXT_ROOT, Express['static'](ROOT_DIR));

    app.use(cors({
        origin: '*'
    }));

    app.use(stormpath.init(app, {
        application: "https://api.stormpath.com/v1/applications/6nmDEYUaVCWYNuxHivKPzm",
        enableAccountVerification: true,
        enableForgotPassword: true,
        registrationUrl: CONTEXT_ROOT + '/register',
        loginUrl: CONTEXT_ROOT + '/login',
        logoutUrl: CONTEXT_ROOT + '/logout',
        postLogoutRedirectUrl: CONTEXT_ROOT + '/login',
        resendAccountVerificationEmailUrl: CONTEXT_ROOT + '/verification/resend',
        forgotPasswordUrl: CONTEXT_ROOT + '/forgot',
        postForgotPasswordRedirectUrl: CONTEXT_ROOT + '/forgot/sent',
        forgotPasswordChangeUrl: CONTEXT_ROOT + '/forgot/change',
        postForgotPasswordChangeRedirectUrl: CONTEXT_ROOT + '/forgot/change/done',
        accountVerificationCompleteUrl: CONTEXT_ROOT + '/verified',
        getOauthTokenUrl: CONTEXT_ROOT + '/oauth',
        redirectUrl: CONTEXT_ROOT,
        facebookLoginUrl: CONTEXT_ROOT + '/facebook',
        googleLoginUrl: CONTEXT_ROOT + '/google',
        idSiteUrl: CONTEXT_ROOT + '/redirect',
        idSiteRegistrationUrl: CONTEXT_ROOT + '/#register'
    }));

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

    app.get(API_ROOT + '/me', stormpath.authenticationRequired, function (req, res) {
        var user = req.user;
        res.json({
            name: user.givenName + " " + user.surname,
            email: user.email
        });
    });

    app.get(API_ROOT + "/servers", stormpath.authenticationRequired, function (request, response) {
        serverManager.listServers().then(function (servers) {
            sendResponse(response, "servers", "success", servers);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.get(API_ROOT + "/servers/:slug", function (request, response) {
        serverManager.findServer(request.param("slug")).then(function (server) {
            sendResponse(response, "server", "success", server);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.listen(process.env.PORT || 8080);
}

main();
