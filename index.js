var express = require('express');
var app = express();

app.get('/', function (req, res){
	res.send("<b>Hello World</b>");
    });

app.listen(8080, function () {
	console.log("Listening on 8080");
    });