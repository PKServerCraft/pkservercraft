/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var DigitalOcean = require('../vendor/javascript/do-wrapper');
var Q = require('q');
var mapper = require("./mappers/ServerMapper");

var TOKEN = process.env.TOKEN;
var SERVERS = process.env.SERVERS || "test1,test2";
//techworld2,crashlanding,dw20,skyfactory2,minecraft

var api = new DigitalOcean(TOKEN, 50);

function buildServerList(images, droplets) {
    var serverIndex,
        serverList = SERVERS.split(","),
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
        serverList = SERVERS.split(","),
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
    api.imagesGetPrivate(function (error, images) {
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
    api.imagesGetPrivate(function (error, images) {
        if (!error) {
            api.dropletsGetAll(function (error, droplets) {
                if (!error) {
                    deferred.resolve(buildServer(slug, images.images, droplets.droplets));
                }
            });
        }

        if (error) {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

