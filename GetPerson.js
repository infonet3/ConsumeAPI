/**
 * Created by mattjones on 7/9/16.
 */
//Packages----------------------------------------------------------------------------------------
var api = require('./API');
var Winston = require("winston");
Winston.add(Winston.transports.File, {filename: "./Logs/ConsumeAPI.log"});

var jade = require('jade');
var fs = require('fs');
var settings = require('./config');

//Process Template Files--------------------------------------------------------------------------
//Get the data from the API
api.GetData(function(data) {

    //Now get all templates
    fs.readdir(settings.templateDirectory, function(err, files) {
        if (err) {
            Winston.error(err);
            return;
        }

        for (var i = 0; i < files.length; i++) {

            var fullPath = settings.templateDirectory + "/" + files[i];
            Winston.info("Template File: " + fullPath);
            
            var fn = jade.compileFile(fullPath);
            var people = {people: {data: data, count: data.length}};
            var outputTemplate = fn(people);

            //Write to file
            var outputFile = settings.outputDirectory + files[i].replace('.jade', '.txt');
            fs.writeFile(outputFile, outputTemplate, function(err) {
                if(err) {
                    Winston.error(err);
                    return;
                }

                Winston.info("Output File Saved: " + fullPath);
            });
        }
    });
});
