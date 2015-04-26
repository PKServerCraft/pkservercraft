/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("./Settings").settings;
var configurationManager = require("./ConfigurationManager");
var mapper = require("./mappers/ServerMapper");

var DigitalOcean = require('do-wrapper');
var api = new DigitalOcean(settings.DIGITALOCEAN_TOKEN, 50);

function buildServerList(configuration, images, droplets) {
    var serverIndex,
        servers = [];

    for (serverIndex in configuration.servers) {
        if (configuration.servers.hasOwnProperty(serverIndex)) {
            servers.push(mapper.map(configuration.servers[serverIndex].server, images, droplets));
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

function validateResponse(response) {
    if (response.id === "unauthorized") {
        throw new Error("Failed to retrieve images");
    }
    return response;
}

exports.startServer = function (slug) {
    var deferred = Q.defer();
    
    exports.findServer(slug).then(function(server) {
        deferred.resolve(server);
    }, function(error) {
        deferred.reject(error);
    });
    
    return deferred.promise;
}
            
exports.stopServer = function () {
    exports.findServer().then(function(server) {
        console.log(server);
    });
}

exports.listServers = function () {
    var deferred = Q.defer(),
        configuration,
        images;

    configurationManager.retrieveServerConfiguration().then(function (_configuration) {
        configuration = _configuration;
        return getAllImages();
    }).then(function (_images) {
        images = validateResponse(_images);
        return getAllDroplets();
    }).then(function (droplets) {
        validateResponse(droplets);
        deferred.resolve(buildServerList(configuration, images.images, droplets.droplets));
    }).then(null, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

exports.findServer = function (slug) {
    var deferred = Q.defer(),
        configuration,
        images,
        server;

    configurationManager.retrieveServerConfiguration().then(function (_configuration) {
        configuration = _configuration;
        return getAllImages();
    }).then(function (_images) {
        images = validateResponse(_images);
        return getAllDroplets();
    }).then(function (droplets) {
        validateResponse(droplets);
        server = buildServer(slug, images.images, droplets.droplets);
        if (server !== undefined) {
            deferred.resolve(server);
        } else {
            deferred.reject({"message": "Server not found", "status": 204});
        }
    }).then(null, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

