/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var config = require("./ConfigurationManager").configuration;
var mapper = require("./mappers/ServerMapper");

var DigitalOcean = require('do-wrapper');
var api = new DigitalOcean(config.DIGITALOCEAN_TOKEN, 50);

var aws = require('aws-sdk');
aws.config.update({accessKeyId: config.AMAZON_ID, secretAccessKey: config.AMAZON_SECRET, region: 'us-east-1'});
var dynamoDB = new aws.DynamoDB();

function writeServerConfiguration() {
    dynamoDB.putItem({
        "TableName" : "PKServerCraftConfigurations",
        "Item" : {
            "CONFIG_ID": { "S": "1" },
            "SERVER": { "S" : "dw20" },
            "Color": { "S": "white" },
            "Name" : { "S": "fancy vase" },
            "Weight" : {"N": "2" },
            "LastName" : { "S" : "Kumar" }
        }
    }, function (err, data) {
        console.log(err);
    });
}

function readServerConfiguration() {
    dynamoDB.getItem({
        "TableName" : "PKServerCraftConfigurations",
        "Key" : {
            "CONFIG_ID": { "S": "1" },
            "SERVER": { "S": "dw20" }
        },
        "AttributesToGet": [
            "Name", "Weight"
        ]
    }, function (err, data) {
        console.log(data.Item.Name.S);
    });
}

//writeServerConfiguration();
//readServerConfiguration();

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

