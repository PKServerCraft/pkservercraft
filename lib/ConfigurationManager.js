/*jslint node: true,nomen: true */
/*globals exports */

"use strict";

exports.configuration = {
    "TOKEN": process.env.DIGITALOCEAN_TOKEN || "",
    "SERVERS": process.env.SERVERS || "test1,test2",
    "SAVE_PREFIX": process.env.SERVER_PREFIX || "-save",
    "HOST": process.env.HOST || "example.com"
};
