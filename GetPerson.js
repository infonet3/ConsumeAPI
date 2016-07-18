/**
 * Created by mattjones on 7/9/16.
 */
//Packages----------------------------------------------------------------------------------------
var api = require('./API');
var Winston = require("winston");
Winston.add(Winston.transports.File, {filename: "./Logs/ConsumeAPI.log"});

var jade = require('jade');
var fs = require('fs');
var moment = require('moment');
var settings = require('./config');
var pg = require('pg');

//Process Template Files--------------------------------------------------------------------------
//Get the data from the API
api.GetData(function(data) {

    /*
    //Now get all templates
    fs.readdir(settings.templateDirectory, function(err, files) {
        if (err) {
            Winston.error(err);
            process.exit(2);
        }

        //Iterate through templates
        for (var i = 0; i < files.length; i++) {

            var fullPath = settings.templateDirectory + "/" + files[i];
            Winston.info("Template File: " + fullPath);
            
            var fn = jade.compileFile(fullPath);
            var people = {people: {data: data, count: data.length, moment: moment}};
            var outputTemplate = fn(people);

            //Write to file
            var outputFile = settings.outputDirectory + files[i].replace('.jade', '.txt');
            fs.writeFile(outputFile, outputTemplate, function(err) {
                if(err) {
                    Winston.error(err);
                    process.exit(2);
                }

                Winston.info("Output File Saved: " + fullPath);
            });
        } //End for loop for template files
    }); //End reading template directory
    */

    //Now save to Postgres
    var config = {
        user: 'postgres', //env var: PGUSER
        database: 'postgres', //env var: PGDATABASE
        password: 'jones211', //env var: PGPASSWORD
        port: 5432, //env var: PGPORT
        max: 1, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    };

    var pool = new pg.Pool(config);

    //Loop through the records
    for (var i = 0; i < data.length; i++) {

        var rec = data[i];
        if (rec.FirstName && rec.LastName && rec.Address && rec.City && rec.State && rec.Zip) {
            pool.connect(function(err, client, done) {
                if(err) {
                    return console.error('error fetching client from pool', err);
                }

                // execute a query on our database
                client.query("INSERT INTO \"Contacts\"(\"FirstName\", \"LastName\", \"Address\", \"City\", \"State\", \"Zip\") VALUES ($1, $2, $3, $4, $5, $6)",
                    [rec.FirstName, rec.LastName, rec.Address, rec.City, rec.State, rec.Zip], function (err, result) {

                        //Put back in the pool
                        done();

                        if(err) {
                            return console.error('error running query', err);
                        }
                        console.log(result);
                });
            });
        }
    }

    pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack)
    });

});
