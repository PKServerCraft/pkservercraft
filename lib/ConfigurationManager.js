/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var settings = require("./Settings").settings;
var dynamoDB = require("./accessors/DynamoDB");

exports.retrieveServerConfiguration = function () {
    return dynamoDB.retrieveServerConfiguration(settings.CONFIGURATION);
};

exports.updateServerConfigurationn = function () {

};
