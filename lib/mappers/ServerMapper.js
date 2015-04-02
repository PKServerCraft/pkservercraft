/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var imageMapper = require("./ImageMapper");
var dropletMapper = require("./DropletMapper");
var settings = require("../accessors/SettingsManager").settings;

exports.map = function (server, images, droplets) {
    var image = imageMapper.findImage(images, server),
        droplet = dropletMapper.findDroplet(droplets, server),
        retVal = {
            "slug": server,
            "image": {
                "name": server + settings.SAVE_PREFIX
            },
            "droplet": {
                "status": "inactive"
            },
            "dns": server + "." + settings.HOST
        };

    if (image !== undefined) {
        retVal.image.id = image.id;
        retVal.image.date = image.created_at;
    }

    if (droplet !== undefined) {
        retVal.droplet.id = droplet.id;
        retVal.droplet.ip_address = droplet.networks.v4[0].ip_address;
        retVal.droplet.status = droplet.status;
    }

    return retVal;
};

