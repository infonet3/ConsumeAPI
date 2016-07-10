/**
 * Created by mattjones on 7/9/16.
 */
//Packages------------------------------------------------------------------------------
var Client = require("node-rest-client").Client;
var client = new Client();

var Winston = require("winston");

//Methods-------------------------------------------------------------------------------
module.exports.GetData = function (cb) {
    client.get("http://localhost:8080/api", function(data, response) {

        Winston.info("Calling GET on the API");
        cb(data);
    });
}

module.exports.PostData = function(data, cb) {
    var args = {
        data: data,
        headers: { "Content-Type": "application/json" }
    }

    client.post("http://localhost:8080/api", args, function(data, response) {
        Winston.info("Calling POST on the API");
        cb();
    });
}

