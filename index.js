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
	rating = xss(req.body.rating); // Validate that this is a number b/t 1-5
	page = xss(req.body.webpage); // Validate this is one of our pages?
	db.addRating(rating, page, function(err, result){
		    if(!err){
			res.send(result);
		    }else{
			console.log(err);
			res.send(err);
		    }
		});
	// Should update to send different responses for success/failure.
	
    });

app.post('/addTaskQuery', function (req, res){
	task = xss(req.body.task);
	comment = xss(req.body.comment);
	page = xss(req.get('Referer'));
	db.addTaskQuery(task, comment, page, function(err, result){
		if(!err){
		    res.send(result);
		}else{
		    console.log(err);
		    res.send(err);
		}
	    });
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

// Start the application listening on port 8080.  In browser localhost:8080/
app.listen(8080, function () {
	console.log("Listening on 8080");
    });