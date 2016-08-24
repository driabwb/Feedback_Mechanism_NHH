// The functions which deal with the database and provide an API 

// ---------------------------------------------------------------
// The database connection and collections

// Connect to the MongoDB database
// Currently connects to the Test database
var db = require('mongoskin').db('mongodb://localhost:27017/Test');
var dbCollection = 'Test';
var dbPageRatingCollection = "PageRatings";
var dbTaskQueryCollection = "TaskQueries";

// ---------------------------------------------------------------

// ---------------------------------------------------------------
// Page Rating functions

// Input into the DB

/* 
  addRating:
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

/*
  getWebsiteRating:
    This function calculates and returns the average rating over all pages in the site.
    On a successful call the function calls the callback with null error string and the average in result.
    On an error the function calls the callback with a error message in err
 */
exports.getWebsiteRating = function(callback){
    db.collection(dbPageRatingCollection).aggregate([{'$group': {'_id': null, 'average': {'$avg': '$rating'}}}], function(err,result){
	    if(!err){
		callback(err, result[0].average);
	    }else{
		console.log(err);
		callback(err, result);
	    }
	});
};

/*
  getWebsiteRatingCounts:
    This function gets the count of occurances for each rating value accross all pages in the site.
    On a successful call the function calls the callback with a null error string and an object with 
      each value as the field and the count in the fields value.
    On failure the function calls the callback with and error message in err.
 */
exports.getWebsiteRatingCounts = function(callback){
    db.collection(dbPageRatingCollection).aggregate([{'$group': {'_id': '$rating', 'count': {'$sum': 1}}}], function(err, result){
	    if(!err){
		retObject = {};
		for(count of result){
		    retObject[count._id] = count.count;
		}
		callback(err, retObject);
	    }else{
		console.log(err);
		callback(err, result);
	    }
	});
};

/*
  addTaskQuery:
    This function takes two strings (already sanitized) and attempts to add them to the Database
    On Success the function calls the callback with a null err and the inserted object in result.
    On Failure the function calls the callback with an error string in err. 
 */
exports.addTaskQuery = function(task, comment, callback){
    db.collection(dbTaskQueryCollection).insert({'task': task, 'comment': comment}, function(err, result){
	    if(!err){
		retObject = {};
		retObject.task = result.ops[0].task;
		retObject.comment = result.ops[0].comment;
		callback(err, retObject);
	    }else{
		callback(err, result);
	    }
	});
};