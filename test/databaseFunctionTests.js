// Tests for the database functions

var assert = require("chai").assert;
var dbFunc = require("../databaseFunctions.js");
var db = require('mongoskin').db('mongodb://localhost:27017/Test');
var dbPageRatingCollection = "PageRatings";

describe("Database Tests", function(){

//------------------------------------------------------------
// Ratings
	describe("Ratings", function(){
// Insert Ratings
		describe("Insertion", function(){
			it("inserts valid inputs into the MongoDB", function(done){
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
		describe("Average for whole website", function(){
			before(function(done){
				// This clears the entire database
				db.collection(dbPageRatingCollection).remove({});
				// Add some test ratings
				db.collection(dbPageRatingCollection).insert([{'webpage': "xkcd", 'rating': 5}, 
									      {'webpage': "xkcd", 'rating': 4},
									      {'webpage': "smbc", 'rating': 4},
									      {'webpage': "smbc", 'rating': 4}], 
									      function(err,res){done();});
			    });
			it("Averages all ratings", function(done){
				dbFunc.getWebsiteRating(function(err, result){
					assert.isTrue(!err);
					assert.strictEqual(result, 17/4);
					done();
				    });
			    });
		    });
		describe("Rating Counts for the whole website", function(){
			before(function(done){
				// This clears the entire database
				db.collection(dbPageRatingCollection).remove({});
				// Add some test ratings
				db.collection(dbPageRatingCollection).insert([{'webpage': "xkcd", 'rating': 5}, 
									      {'webpage': "xkcd", 'rating': 4},
									      {'webpage': "smbc", 'rating': 2},
									      {'webpage': "smbc", 'rating': 4},
									      {'webpage': "berk", 'rating': 2},
									      {'webpage': "berk", 'rating': 1},
									      {'webpage': "smbc", 'rating': 1},
									      {'webpage': "xkcd", 'rating': 3},
									      {'webpage': "berk", 'rating': 4}], 
									      function(err,res){done();});
			    });
			it("Give back counts for each rating accross all pages.", function(done){
				dbFunc.getWebsiteRatingCounts(function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {1: 2, 2: 2, 3: 1, 4: 3, 5: 1});
					done();
				    });
			    });
		    });
	    }); // End Rating Tests
	describe("Task Query Tests", function(){
		describe("Insertion", function(){
			it("Can insert an entry", function(done){
				dbFunc.addTaskQuery("I'm Unit Testing!!!", "My test seems to be failing.", function(err,result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'task': "I'm Unit Testing!!!", 'comment': "My test seems to be failing."});
					done();
				    });
			    });
		    }); // End Insertion Tests
	    });// End Task Query Tests
//-------------------------------------------------------------
// End Database Tests
    });