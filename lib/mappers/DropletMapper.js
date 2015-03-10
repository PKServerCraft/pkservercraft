/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var moment = require("moment");

exports.isDroplet = function (server, possibleDroplet) {
    return (possibleDroplet.name.indexOf(server) === 0);
};

exports.findDroplet = function (droplets, server) {
    var droplet, index;
    for (index in droplets) {
        if (droplets.hasOwnProperty(index) &&
                this.isDroplet(server, droplets[index])) {
            droplet = droplets[index];
        }
    }

    return droplet;
};

