/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var DEFAULTS = {
    "TOKEN": "",
    "SERVERS": "test1,test2",
    "SAVE_PREFIX": "-save",
    "HOST": "example.com"
};

exports.configuration = {
    "TOKEN": process.env.DIGITALOCEAN_TOKEN     || DEFAULTS.TOKEN,
    "SERVERS": process.env.SERVERS              || DEFAULTS.SERVERS,
    "SAVE_PREFIX": process.env.SERVER_PREFIX    || DEFAULTS.SERVER_PREFIX,
    "HOST": process.env.HOST                    || DEFAULTS.HOST
};

exports.forceDefaults = function () {
    exports.configuration = DEFAULTS;
}
