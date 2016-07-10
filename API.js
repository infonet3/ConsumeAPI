/**
 * Created by mattjones on 7/9/16.
 */
//Packages------------------------------------------------------------------------------
var Client = require("node-rest-client").Client;
var client = new Client();

var Winston = require("winston");
var settings = require("./config");

//Methods-------------------------------------------------------------------------------
module.exports.GetData = function (cb) {
    client.get(settings.GETUrl, function(data, response) {

        Winston.info("Calling GET on the API");
        cb(data);
    })
    .on('requestTimeout', function(reg) {
        Winston.error("GetData: RequestTimeout");
        process.exit(1);
    })
    .on('responseTimeout', function(reg) {
        Winston.error("GetData: ResponseTimeout");
        process.exit(1);
    })
    .on('error', function(reg) {
        Winston.error("GetData: Error");
        process.exit(1);
    });
}

module.exports.PostData = function(data, cb) {
    var args = {
        data: data,
        headers: { "Content-Type": "application/json" }
    }

    client.post(settings.POSTUrl, args, function(data, response) {
        Winston.info("Calling POST on the API");
        cb();
    })
    .on('requestTimeout', function(reg) {
        Winston.error("PostData: RequestTimeout");
        process.exit(1);
    })
    .on('responseTimeout', function(reg) {
        Winston.error("PostData: ResponseTimeout");
        process.exit(1);
    })
    .on('error', function(reg) {
        Winston.error("PostData: Error");
        process.exit(1);
    });
}

