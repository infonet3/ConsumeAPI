/**
 * Created by mattjones on 7/9/16.
 */
//Packages-----------------------------------------------------------------------------
var api = require('./API');
var Winston = require("winston");
Winston.add(Winston.transports.File, {filename: "ConsumeAPI.log"});

var jade = require('jade');
var fs = require('fs');

//Get the data
api.GetData(function(data) {

    //Now get all templates
    var directory = './Templates';
    fs.readdir(directory, function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        for (var i = 0; i < files.length; i++) {

            var fullPath = directory + "/" + files[i];
            Winston.info("Template File: " + fullPath);
            var fn = jade.compileFile(fullPath);
            var people = {people: {data: data, count: data.length}};
            var outputTemplate = fn(people);

            //Write to file
            var outputFile = "./Output/" + files[i].replace('.jade', '.txt');
            fs.writeFile(outputFile, outputTemplate, function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        }
    });
});
