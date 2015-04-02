/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var settings = require("./SettingsManager").settings;
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

exports.retrieveServerConfiguration = function () {

};

exports.updateServerConfigurationn = function () {

};
