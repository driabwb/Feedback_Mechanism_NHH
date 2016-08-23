// Tests for the database functions

var expect = require("chai").expect;
var dbFunc = require("../databaseFunctions.js");

describe("Database Tests", function(){

//------------------------------------------------------------
// Ratings
	describe("Ratings", function(){
// Insert Ratings
		describe("Insertion", function(){
			it("inserts valid inputs into the MongoDB and returns true", function(){
				dbFunc.addRating(3, "http://foo.bar/", function(err, result){
					assert.isTrue(!err);
					assert.DeepEqual(result, {"Name": "http://foo.bar/", "Rating": 3});
				    });
			    }); // End valid inputs
		    }); //End Insertion
	    }); // End Rating Tests

//-------------------------------------------------------------
// End Database Tests
    });