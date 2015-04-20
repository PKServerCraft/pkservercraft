/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("../Settings").settings;
var aws = require('aws-sdk');

aws.config.update({accessKeyId: settings.AMAZON_ID, secretAccessKey: settings.AMAZON_SECRET, region: 'us-east-1'});
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

function readServerConfiguration(id) {
    var deferred = Q.defer();
    dynamoDB.getItem({
        "TableName" : "PKSC-ServerConfiguration",
        "Key" : {
            "CONFIG_ID": { "S": id }
        },
        "AttributesToGet": [
            "Name", "Weight"
        ]
    }, function (err, data) {
        if (err !== undefined) {
            deferred.reject(err);
        } else {
            deferred.resolve(data.Item.Name.S);
        }
    });
    
    return deferred.promise;
}

exports.retrieveServerConfiguration = function (id) {
    return readServerConfiguration(id);
};

