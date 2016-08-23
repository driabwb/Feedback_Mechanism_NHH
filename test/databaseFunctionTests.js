// Tests for the database functions

var assert = require("chai").assert;
var dbFunc = require("../databaseFunctions.js");

describe("Database Tests", function(){

//------------------------------------------------------------
// Ratings
	describe("Ratings", function(){
// Insert Ratings
		describe("Insertion", function(){
			it("inserts valid inputs into the MongoDB and returns true", function(done){
				dbFunc.addRating(3, "http://foo.bar/", function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {"webpage": "http://foo.bar/", "rating": 3});
					done();
				    });
			    }); // End valid inputs
			it("1 is a valid input", function(done){
				dbFunc.addRating(1, "asdf", function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {"webpage": "asdf", "rating": 1});
					done();
				    });
			    });
			it("0 is not a valid input", function(done){
				dbFunc.addRating(0, "asdf", function(err, result){
					assert.equal(err, "Rating out of range:0");
					assert.isNull(result);
					done();
				    });
			    });
			it("6 is not a valid input", function(done){
				dbFunc.addRating(6, "asdf", function(err, result){
					assert.equal(err, "Rating out of range:6");
					assert.isNull(result);
					done();
				    });
			    });
			it("5 is a valid input", function(done){
				dbFunc.addRating(5, "asdf", function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {"webpage": "asdf", "rating": 5});
					done();
				    });
			    });
		    }); //End Insertion
	    }); // End Rating Tests

//-------------------------------------------------------------
// End Database Tests
    });