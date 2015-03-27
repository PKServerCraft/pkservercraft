/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

var DEFAULTS = {
    "DIGITALOCEAN_TOKEN": "",
    "AMAZON_ID": "",
    "AMAZON_KEY": "",
    "SERVERS": "test1,test2",
    "SAVE_PREFIX": "-save",
    "HOST": "example.com",
    "ROOT_DIR": "",
    "CONTEXT_ROOT": "/pkservercraft",
    "API_ROOT": "/api/v1"
};

exports.configuration = {
    "DIGITALOCEAN_TOKEN": process.env.DIGITALOCEAN_TOKEN    || DEFAULTS.DIGITALOCEAN_TOKEN,
    "AMAZON_ID"         : process.env.AMAZON_ID             || DEFAULTS.AMAZON_ID,
    "AMAZON_SECRET"     : process.env.AMAZON_SECRET         || DEFAULTS.AMAZON_SECRET,
    "SERVERS"           : process.env.SERVERS               || DEFAULTS.SERVERS,
    "SAVE_PREFIX"       : process.env.SERVER_PREFIX         || DEFAULTS.SERVER_PREFIX,
    "HOST"              : process.env.HOST                  || DEFAULTS.HOST,
    "ROOT_DIR"          : process.env.ROOT_DIR              || DEFAULTS.ROOT_DIR,
    "CONTEXT_ROOT"      : process.env.CONTEXT_ROOT          || DEFAULTS.CONTEXT_ROOT,
    "API_ROOT"          : process.env.API_ROOT              || DEFAULTS.API_ROOT
};

exports.forceDefaults = function () {
    exports.configuration = DEFAULTS;
};

exports.retrieveServerConfiguration = function () {
    
}

exports.updateServerConfigurationn = function () {
    
}