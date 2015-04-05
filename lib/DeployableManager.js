/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("./accessors/SettingsManager").settings;
var s3 = require("./accessors/S3Manager");

function parseDeployableInfo(path) {
    var retVal = null,
        splits = path.split("/");
    if (splits.length === 3) {
        retVal = {
            "slug": splits[0],
            "version": splits[1],
            "file": splits[2]
        };
    }
    return retVal;
}

function findDeployable(deployables, deployableInfo) {
    var index;

    for (index in deployables) {
        if (deployables.hasOwnProperty(index)) {
            if (deployables[index].slug === deployableInfo.slug) {
                return deployables[index];
            }
        }
    }

    return null;
}

function findVersion(deployables, deployableInfo) {
    var index,
        deployable = findDeployable(deployables, deployableInfo);

    for (index in deployable.versions) {
        if (deployable.versions.hasOwnProperty(index)) {
            if (deployable.versions[index].version === deployableInfo.version) {
                return deployable.versions[index];
            }
        }
    }

    return null;
}

function findFile(deployables, deployableInfo) {
    var index,
        version = findVersion(deployables, deployableInfo);

    for (index in version.files) {
        if (version.files.hasOwnProperty(index)) {
            if (version.files[index].version === deployableInfo.file) {
                return version.files[index];
            }
        }
    }

    return null;
}

function addDeployables(objects, deployables) {
    var deployableInfo, objectIndex, deployable;
    for (objectIndex in objects) {
        if (objects.hasOwnProperty(objectIndex)) {
            deployableInfo = parseDeployableInfo(objects[objectIndex].Key);
            deployable = findDeployable(deployables, deployableInfo);
            if (deployable === null) {
                deployables.push({
                    "slug": deployableInfo.slug,
                    "versions": []
                });
            }
        }
    }
}

function addVersions(objects, deployables) {
    var deployableInfo, objectIndex, deployable, version;
    for (objectIndex in objects) {
        if (objects.hasOwnProperty(objectIndex)) {
            deployableInfo = parseDeployableInfo(objects[objectIndex].Key);
            deployable = findDeployable(deployables, deployableInfo);
            version = findVersion(deployables, deployableInfo);
            if (version === null) {
                deployable.versions.push({
                    "version": deployableInfo.version,
                    "files": []
                });
            }
        }
    }
}

function addFiles(objects, deployables) {
    var deployableInfo, objectIndex, deployable, version, file;
    for (objectIndex in objects) {
        if (objects.hasOwnProperty(objectIndex)) {
            deployableInfo = parseDeployableInfo(objects[objectIndex].Key);
            version = findVersion(deployables, deployableInfo);
            file = findFile(deployables, deployableInfo);
            if (file === null) {
                version.files.push(deployableInfo.file);
            }
        }
    }
}

exports.listDeployables = function () {
    var deferred = Q.defer();

    s3.getAllObjects().then(function (objects) {
        var deployables = [];

        addDeployables(objects.Contents, deployables);
        addVersions(objects.Contents, deployables);
        addFiles(objects.Contents, deployables);

        deferred.resolve(deployables);
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
};
