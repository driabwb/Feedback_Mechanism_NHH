// These start up express, which handles requests
var express = require('express');
// Parse post body
var bodyParser = require('body-parser');
//var multer = require('multer');
// Actual objects to work with from the above
//var upload = multer();
var app = express();

// Cross-site Scripting Sanitizer
var xss = require('xss');

// Database Related Functions
var db = require('./databaseFunctions.js');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Direction if a GET Request is preformed for the root of the site
app.get('/', function(req, res){
	// Redirect root to index.html
	res.redirect('/index.html');
    });

// Accept data for a basic page rating
app.post('/addRating', function (req, res){
	// Sanitization is expected to be done here validation can be also
	rating = xss(req.body.Rating); // Validate that this is a number b/t 1-5
	page = xss(req.body.WebPage); // Validate this is one of our pages?
	db.addRating(rating, page);
	// Should update to send different responses for success/failure.
	res.send(req.body);
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

/*
This is here a refernce for database calls

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
*/

// Start the application listening on port 8080.  In browser localhost:8080/
app.listen(8080, function () {
	console.log("Listening on 8080");
    });