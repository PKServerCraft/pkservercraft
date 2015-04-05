/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("./SettingsManager").settings;
var aws = require('aws-sdk');

aws.config.update({accessKeyId: settings.AMAZON_ID, secretAccessKey: settings.AMAZON_SECRET, region: 'us-east-1'});
var s3 = new aws.S3();

exports.getAllObjects = function () {
    var deferred = Q.defer(),
        params = {
            Bucket: 'deployment.paulkimbrel.com',
            Marker: ''
        };

    s3.listObjects(params, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

