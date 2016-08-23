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
    On successful entry returns true.
    On failed entry returns false
    If 1 > rating or 5 < rating returns false
*/
exports.addRating = function (rating, webpage){
    // Do Validation, but not sanitization
    // TODO: Validation of inputs
    db.collection(dbPageRatingCollection).insert({'webpage': webpage, 'rating': rating});  
};