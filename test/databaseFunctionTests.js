// Tests for the database functions

var assert = require("chai").assert;
var dbFunc = require("../databaseFunctions.js");
var db = require('mongoskin').db('mongodb://localhost:27017/Test');
var dbPageRatingCollection = "PageRatings";
var dbTaskQueryCollection = "TaskQueries";

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
		describe("Average rating by page", function(){
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
			it("Performs a count for all pages if given an empty array", function(done){
				dbFunc.getPageRating([], function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'xkcd': 4, 'smbc': 7/3, 'berk': 7/3});
					done();
				    });
			    });
			it("Performs a count for only the specified page w/ 1 elt array", function(done){
				dbFunc.getPageRating(['xkcd'], function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'xkcd': 4});
					done();
				    });
			    });
			it("Performs a count for only the specified page w/ 2 elt array", function(done){
				dbFunc.getPageRating(['smbc', 'xkcd'], function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'smbc': 7/3, 'xkcd': 4});
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
				dbFunc.addTaskQuery("I'm Unit Testing!!!", "My test seems to be failing.", "Help Help I'm trapped in a Unit Test Factory.", function(err,result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'task': "I'm Unit Testing!!!", 'comment': "My test seems to be failing."});
					done();
				    });
			    });
		    }); // End Insertion Tests
		describe("Last N Retrieval", function(){
			before(function(done){
				db.collection(dbTaskQueryCollection).remove({});
				db.collection(dbTaskQueryCollection).insert([{'task': "I'm Unit Testing!!!", 'comment': "My test seems to be failing.", 'webpage': "Help Help I'm stuck in a Unit Test Factory"},
									     {'task': "Test2", 'comment': "Yipee ki-yay", 'webpage': "Jenny don't"},
									     {'task': "Look Ma no honds", 'comment': "and all our yesterdays", 'webpage': "change"},
									     {'task': "She should have died", 'comment': "have lighted fools", 'webpage': "your"},
									     {'task': "hereafter there would", 'comment': "the way to dusty", 'webpage': "number"},
									     {'task': "have been time for ", 'comment': "death out out brief", 'webpage': "8675"},
									     {'task': "such a word tomorrow and", 'comment': "candle life is but", 'webpage': "309"},
									     {'task': "tomorrow and tomorrow", 'comment': "a walking shadow", 'webpage': "8675"},
									     {'task': "creeps in this petty", 'comment': "a poor player's that", 'webpage': "309"},
									     {'task': "pace from day to day", 'comment': "struts and frets his hour", 'webpage': "8675"},
									     {'task': "to the last syllable", 'comment': "upon the stage and then is heard no more", 'webpage': "309"},
									     {'task': "of recorded time", 'comment': "it is a tale told by and idiot full of sound and fury signifying nothing. - Shakespeare", 'webpage': "Jenny - Tommy Tutone"}], 
									    function(err, res){
										done();
									    });
			    });
			it("can pull the last 3 entries", function(done){
				dbFunc.getTaskQuery(3, function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, [{'task': "pace from day to day", 'comment': "struts and frets his hour", 'webpage': "8675"},
								  {'task': "to the last syllable", 'comment': "upon the stage and then is heard no more", 'webpage': "309"},
								  {'task': "of recorded time", 'comment': "it is a tale told by and idiot full of sound and fury signifying nothing. - Shakespeare", 'webpage': "Jenny - Tommy Tutone"}]);
					done();
				    });
			    });
			it("can pull the last 1 entries", function(done){
				dbFunc.getTaskQuery(1, function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, [{'task': "of recorded time", 'comment': "it is a tale told by and idiot full of sound and fury signifying nothing. - Shakespeare", 'webpage': "Jenny - Tommy Tutone"}]);
					done();
				    });
			    });

			it("can pull the last 0 entries", function(done){
				dbFunc.getTaskQuery(0, function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, []);
					done();
				    });
			    });
			it("cannot pull negative entries", function(done){
				dbFunc.getTaskQuery(-1, function(err, result){
					assert.equal(err, "You must request 0 or more task queries");
					done();
				    });
			    });
			it("can pull the last 10 entries", function(done){
				dbFunc.getTaskQuery(10, function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, [
								  {'task': "Look Ma no honds", 'comment': "and all our yesterdays", 'webpage': "change"},
								  {'task': "She should have died", 'comment': "have lighted fools", 'webpage': "your"},
								  {'task': "hereafter there would", 'comment': "the way to dusty", 'webpage': "number"},
								  {'task': "have been time for ", 'comment': "death out out brief", 'webpage': "8675"},
								  {'task': "such a word tomorrow and", 'comment': "candle life is but", 'webpage': "309"},
								  {'task': "tomorrow and tomorrow", 'comment': "a walking shadow", 'webpage': "8675"},
								  {'task': "creeps in this petty", 'comment': "a poor player's that", 'webpage': "309"},
								  {'task': "pace from day to day", 'comment': "struts and frets his hour", 'webpage': "8675"},
								  {'task': "to the last syllable", 'comment': "upon the stage and then is heard no more", 'webpage': "309"},
								  {'task': "of recorded time", 'comment': "it is a tale told by and idiot full of sound and fury signifying nothing. - Shakespeare", 'webpage': "Jenny - Tommy Tutone"}]); 
					done();
				    });
			    });
		    });
		describe("Comment Counts", function(){
			before(function(done){
				db.collection(dbTaskQueryCollection).remove({});
				db.collection(dbTaskQueryCollection).insert([{'task': "I'm Unit Testing!!!", 'comment': "My test seems to be failing.", 'webpage': "Help Help I'm stuck in a Unit Test Factory"},
									     {'task': "Test2", 'comment': "Yipee ki-yay", 'webpage': "Jenny don't"},
									     {'task': "Look Ma no honds", 'comment': "and all our yesterdays", 'webpage': "change"},
									     {'task': "She should have died", 'comment': "have lighted fools", 'webpage': "your"},
									     {'task': "hereafter there would", 'comment': "the way to dusty", 'webpage': "number"},
									     {'task': "have been time for ", 'comment': "death out out brief", 'webpage': "8675"},
									     {'task': "such a word tomorrow and", 'comment': "candle life is but", 'webpage': "309"},
									     {'task': "tomorrow and tomorrow", 'comment': "a walking shadow", 'webpage': "8675"},
									     {'task': "creeps in this petty", 'comment': "a poor player's that", 'webpage': "309"},
									     {'task': "pace from day to day", 'comment': "struts and frets his hour", 'webpage': "8675"},
									     {'task': "to the last syllable", 'comment': "upon the stage and then is heard no more", 'webpage': "309"},
									     {'task': "of recorded time", 'comment': "it is a tale told by and idiot full of sound and fury signifying nothing. - Shakespeare", 'webpage': "Jenny - Tommy Tutone"}], 
									    function(err, res){
										done();
									    });
			    });
			it("Counts for all pages", function(done){
				dbFunc.getTaskCounts([], function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'Jenny - Tommy Tutone': 1, '309': 3, '8675': 3, "Jenny don't": 1, "change": 1, "your": 1, "number": 1,
						    "Help Help I'm stuck in a Unit Test Factory": 1 });
					done();
				    });
			    });
			it("Counts for 1 specified pages", function(done){
				dbFunc.getTaskCounts(["309"], function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'309': 3});
					done();
				    });
			    });
			it("Counts for 3 specified pages", function(done){
				dbFunc.getTaskCounts(['309', 'change', '8675'], function(err, result){
					assert.isTrue(!err);
					assert.deepEqual(result, {'309': 3, 'change': 1, '8675': 3});
					done();
				    });
			    });
		    });
	    });// End Task Query Tests
//-------------------------------------------------------------
// End Database Tests
    });