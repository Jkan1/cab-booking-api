const sqlCred= require('../config/config')
const mysql=require('mysql');

//Create connection to mysql database
const connection=mysql.createConnection ({
 host:  sqlCred.mysqlCred.HOST,
 user:  sqlCred.mysqlCred.USER,
 password:  sqlCred.mysqlCred.PASSWORD,
 database:  sqlCred.mysqlCred.DATABASE
});

//Export database connection object
module.exports=connection