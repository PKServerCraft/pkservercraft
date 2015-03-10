/*global require, process, console, setInterval, clearInterval */
/*jslint plusplus: true */

var Express = require('express');
var cors = require('cors');
var serverManager = require('./lib/ServerManager');

//Constants
var CONTEXT_ROOT = process.env.CONTEXT_ROOT || "/pkservercraft/v1";
var ROOT_DIR = process.env.ROOT_DIR;

function main() {
    "use strict";

    var app = new Express();
    app.use(Express["static"](ROOT_DIR));

    app.use(cors({
        origin: '*'
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

    app.get(CONTEXT_ROOT + "/servers", function (request, response) {
        serverManager.listServers().then(function (servers) {
            sendResponse(response, "servers", "success", servers);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.get(CONTEXT_ROOT + "/servers/:slug", function (request, response) {
        serverManager.findServer(request.param("slug")).then(function (server) {
            sendResponse(response, "server", "success", server);
        }, function (error) {
            sendError(response, error);
        });
    });

    app.listen(process.env.PORT || 8080);
}

main();
