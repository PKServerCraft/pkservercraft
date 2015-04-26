/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var Q = require('q');
var settings = require("./Settings").settings;
var s3 = require("./accessors/S3");
var configurationManager = require("./ConfigurationManager");

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

function isDeployableInConfiguration(configuration, slug) {
    var index;
    
    if (configuration === undefined) {
        return true;
    }
    
    console.log("Searching for: " + slug);
    
    if (configuration.deployables !== undefined) {
        for (index in configuration.deployables) {
            console.log(configuration.deployables[index].deployable);
            if (configuration.deployables.hasOwnProperty(index) &&
                    configuration.deployables[index].deployable === slug) {
                return true;
            }
        }
    }
    return false;
}

function findDeployable(deployables, deployableInfo, configuration) {
    var index;

    for (index in deployables) {
        if (deployables.hasOwnProperty(index) &&
                isDeployableInConfiguration(configuration, deployables[index].slug) &&
                (deployables[index].slug === deployableInfo.slug)) {
            return deployables[index];
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

function addDeployables__(objects, deployables, configuration) {
    var deployableInfo, objectIndex, deployable;
    for (objectIndex in objects) {
        if (objects.hasOwnProperty(objectIndex)) {
            deployableInfo = parseDeployableInfo(objects[objectIndex].Key);
            deployable = findDeployable(deployables, deployableInfo, configuration);
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

function buildDeployables__(configuration, objects) {
    var deployables = [];
    
    if (configuration.deployables !== undefined) {
        for (index in configuration.deployables) {
            if (configuration.deployables.hasOwnProperty(index)) {
                //addDeployables(deployables, configuration.deployables[index]).
            }
        }
    }
    
    return deployables;
}

exports.listDeployables = function () {
    var deferred = Q.defer(),
        configuration;

    configurationManager.retrieveServerConfiguration().then(function (_configuration) {
        configuration = _configuration;
        return s3.getAllObjects();
    }).then(function (objects) {
        var deployables = [];

        //addDeployables(objects.Contents, deployables, configuration);
        //addVersions(objects.Contents, deployables);
        //addFiles(objects.Contents, deployables);

        deferred.resolve(deployables);
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
};
