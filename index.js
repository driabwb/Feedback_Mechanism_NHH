// These start up express, which handles requests
var express = require('express');
var app = express();

// Direction if a GET Request is preformed for the root of the site
app.get('/', function(req, res){
	// Redirect root to index.html
	res.redirect('/index.html');
    });

// If a user asks for something with a GET Request try to give it to them from the /static_pages/ directory.
app.get('/:fileName', function (req, res){
	// Root specifies where to search for the file
	var options = {
	    root: __dirname + "/static_pages/"
	}
	// Grab the variable fileName in the URI
	var fileName =  req.params.fileName;
	// Return to the user the specified file
	res.sendFile(fileName, options);
    });

var db = require('mongoskin').db('mongodb://localhost:27017/Test');
db.collection('Test').insert({'name': "Fred", 'colour': "Blue"});
db.collection('Test').findOne({'name': "Fred"}, function(err, res){
	if(!err){
	    console.log(res);
	}
    });
db.collection('Test').remove({'name': "Fred"});
db.collection('Test').findOne({'name': "Fred"}, function(err, res){
	if(!err){
	    console.log(res);
	}
    });

// Start the application listening on port 8080.  In browser localhost:8080/
app.listen(8080, function () {
	console.log("Listening on 8080");
    });