/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("../Settings").settings;
var DigitalOcean = require('do-wrapper');
var api = new DigitalOcean(settings.DIGITALOCEAN_TOKEN, 50);

var serverState = {};

function determineLocalState(server) {
    var localState = serverState[server.slug];

    if (localState === undefined) {
        localState = server.droplet.status;
    }

    return localState;
}

exports.createServer = function (server) {
    var deferred = Q.defer(),
        localState = determineLocalState(server);

    if (localState === "inactive") {
        deferred.resolve("stuff");
    }

    return deferred.promise;
};
