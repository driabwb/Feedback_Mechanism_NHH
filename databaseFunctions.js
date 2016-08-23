// The functions which deal with the database and provide an API 

// ---------------------------------------------------------------
// The database connection and collections

// Connect to the MongoDB database
// Currently connects to the Test database
var db = require('mongoskin').db('mongodb://localhost:27017/Test');
var dbCollection = 'Test';
var dbPageRatingCollection = "PageRatings";

// ---------------------------------------------------------------

// ---------------------------------------------------------------
// Page Rating functions

// Input into the DB

/* 
  addRating: Number, String -> Boolean
    This function takes a rating (1-5) and a page url and attempts to store the data
      in the database.
    On successful entry calls callback(null, inserted_object)
    On failure calls callback("Error Message", null)
*/
exports.addRating = function (rating, webpage, callback){
    // Do Validation, but not sanitization
    if(1>rating || rating>5){
	callback("Rating out of range:" + rating.toString(), null);
    }
    db.collection(dbPageRatingCollection).insert({'webpage': webpage, 'rating': rating}, function(err, result){
	    if(!err){
		resultObj = {};
		resultObj.webpage = result.ops[0].webpage;
		resultObj.rating = result.ops[0].rating;
		callback(err, resultObj);
	    }else{
		callback(err, result);
	    }
	});  
};