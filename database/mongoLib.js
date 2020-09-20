const MongoClient = require('mongodb').MongoClient;

//Mongodb server url
var url = "mongodb://localhost:27017/";

//Create connection to DB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
  if (err) throw err;
  var dbo = db.db(CONFIG.mongoCred.DATABASE);

  //Export the database connection object
  module.exports.dbo = dbo;
}); 
