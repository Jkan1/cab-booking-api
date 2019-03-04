const MongoClient = require('mongodb').MongoClient;

//Mongodb server url
var url = "mongodb://localhost:27017/";

//Create connection to DB
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  var dbo = db.db(CONFIG.mongoCred.DB);

  //Export the database connection object
  module.exports.dbo = dbo;
}); 
