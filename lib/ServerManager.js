/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var DigitalOcean = require('do-wrapper');
var Q = require('q');
var config = require("./ConfigurationManager");
var mapper = require("./mappers/ServerMapper");

//techworld2,crashlanding,dw20,skyfactory2,minecraft

var api = new DigitalOcean(config.DIGITALOCEAN_TOKEN, 50);

function buildServerList(images, droplets) {
    var serverIndex,
        serverList = config.SERVERS.split(","),
        servers = [];

    for (serverIndex in serverList) {
        if (serverList.hasOwnProperty(serverIndex)) {
            servers.push(mapper.map(serverList[serverIndex], images, droplets));
        }
    }

    return servers;
}

function buildServer(slug, images, droplets) {
    var serverIndex,
        serverList = config.SERVERS.split(","),
        server;

    for (serverIndex in serverList) {
        if (serverList.hasOwnProperty(serverIndex) &&
                (serverList[serverIndex] === slug)) {
            server = mapper.map(serverList[serverIndex], images, droplets);
        }
    }

    return server;
}

exports.listServers = function () {
    var deferred = Q.defer();
    api.imagesGetAll(true, function (error, images) {
        if (!error) {
            api.dropletsGetAll(function (error, droplets) {
                if (!error) {
                    deferred.resolve(buildServerList(images.images, droplets.droplets));
                }
            });
        }

        if (error) {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

exports.findServer = function (slug) {
    var deferred = Q.defer();
    api.imagesGetAll(true, function (error, images) {
        if (!error) {
            api.dropletsGetAll(function (error, droplets) {
                if (!error) {
                    var server = buildServer(slug, images.images, droplets.droplets);
                    if (server !== undefined) {
                        deferred.resolve(server);
                    } else {
                        deferred.reject({"message": "Server not found", "status": 404});
                    }
                }
            });
        }

        if (error) {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

