// These start up express, which handles requests
var express = require('express');
// Parse post body
var bodyParser = require('body-parser');
//var multer = require('multer');
// Actual objects to work with from the above
//var upload = multer();
var app = express();

var xss = require('xss');

// Connect to the MongoDB database
// Currently connects to the Test database
var db = require('mongoskin').db('mongodb://localhost:27017/Test');
var dbCollection = 'Test';

// The form types
var ratingType = "rating";
var shortAnswerType = "shortAnswer";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Direction if a GET Request is preformed for the root of the site
app.get('/', function(req, res){
	// Redirect root to index.html
	res.redirect('/index.html');
    });

app.post('/addRating', function (req, res){
	var dbObject = req.body;
	dbObject.inputType = ratingType;
	dbObject.Name = xss(dbObject.Name);
	db.collection(dbCollection).insert(dbObject);
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