/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("./Settings").settings;
var mapper = require("./mappers/ServerMapper");

var DigitalOcean = require('do-wrapper');
var api = new DigitalOcean(settings.DIGITALOCEAN_TOKEN, 50);

function buildServerList(images, droplets) {
    var serverIndex,
        serverList = settings.SERVERS.split(","),
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
        serverList = settings.SERVERS.split(","),
        server;

    for (serverIndex in serverList) {
        if (serverList.hasOwnProperty(serverIndex) &&
                (serverList[serverIndex] === slug)) {
            server = mapper.map(serverList[serverIndex], images, droplets);
        }
    }

    return server;
}

function getAllImages() {
    var deferred = Q.defer();
    
    api.imagesGetAll(true, function (error, images) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(images);
        }
    });
    
    return deferred.promise;
}

function getAllDroplets() {
    var deferred = Q.defer();
    
    api.dropletsGetAll(function (error, images) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(images);
        }
    });
    
    return deferred.promise;
}

exports.listServers = function () {
    var deferred = Q.defer(),
        images;

    getAllDroplets().then(function (allImages) {
        images = allImages;
        return getAllDroplets();
    }).then(function (droplets) {
        return buildServerList(images.images, droplets.droplets);
    }).then(function (servers) {
        deferred.resolve(servers);
    }, function (error) {
        deferred.resolve(error);
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

