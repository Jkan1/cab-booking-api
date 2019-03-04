const db = require('../database/mysqlLib')
const jwt = require('jsonwebtoken')

//All function exports
module.exports.addSignup = addSignup;
module.exports.checkEmailExistance = checkEmailExistance;
module.exports.fetchLoginDetails = fetchLoginDetails;
module.exports.getEmailByToken = getEmailByToken;
module.exports.insertBookingDetails = insertBookingDetails;
module.exports.getBookingDetail = getBookingDetail;
module.exports.getcustomerDetailsByEmail = getcustomerDetailsByEmail;
module.exports.updateBookingTable = updateBookingTable;
module.exports.fetchDriverStatus = fetchDriverStatus;
module.exports.setStatusOfDriver = setStatusOfDriver;
module.exports.getcustomerID = getcustomerID;
module.exports.getcustomerBookingDetails = getcustomerBookingDetails;
module.exports.addRatingsOnDriver = addRatingsOnDriver;
module.exports.checkAvailableBooking = checkAvailableBooking;
module.exports.checkExistingPendingBooking = checkExistingPendingBooking;
module.exports.cancelBooking = cancelBooking;

//All function definitions

function checkExistingPendingBooking(customerID) {
	return new Promise((resolve, reject) => {
		db.query("SELECT booking_id FROM booking WHERE customer_id=? AND (booking_status=0 OR booking_status=1) ", [customerID], function (err, data) {
			if(err){
				reject(err);
			}
			if(data[0]==undefined){
				resolve(-1)
			}
			else{
				resolve(data[0].booking_id);
			}
		});
	})
}

function addSignup(req, res) {
	db.query("INSERT INTO customer( customer_name, customer_email, customer_phone, password_hash) VALUES (?,?,?,?)", [req.body.name, req.body.email, req.body.phone, req.hash], function (err, data) {
		if (err) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SERVER_ERROR,
				error: err.message,
				message: "Some error occurred"
			});
		}
		else {
			db.query("SELECT customer_id,customer_name,customer_email FROM customer WHERE customer_email= ?", req.body.email, function (err, data) {
				res.send({
					statusCode: 200,
					message: 'Customer inserted successfully in database.',
					data: {
						customer_id: data[0].customer_id,
						customer_name: data[0].customer_name,
						customer_email: data[0].customer_email
					}
				});
			})
		}
	})
}

function checkEmailExistance(req, res) {
	return new Promise((resolve, reject) => {
		db.query("SELECT password_hash FROM customer WHERE customer_email=?", req.body.email, function (err, val) {
			if (err) {
				reject(err);
			}
			else {
				resolve(val);
			}
		})
	})
}

function fetchLoginDetails(req, res) {
	db.query("SELECT customer_id,customer_name ,customer_email, customer_phone FROM customer WHERE customer_email=?", req.body.email, function (err, detail) {
		if (err) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SERVER_ERROR,
				error: err.message,
				message: "Some error occurred"
			});
		}
		else {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.LOGIN_SUCCESSFULLY,
				message: "Successfully Logged in",
				WELCOME: {
					customer_id: detail[0].customer_id,
					customer_name: detail[0].customer_name,
					customer_email: detail[0].customer_email,
					customer_phone: detail[0].customer_phone,
					token: req.token
				}
			})
		}
	})
}

function getEmailByToken(req, res) {
	return new Promise(function (resolve, reject) {
		jwt.verify(req.body.token, CONFIG.privateKey, (err, value) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(value.email)
			}
		})
	})
}

function insertBookingDetails(req, res) {
	return new Promise(function (resolve, reject) {
		db.query("SELECT customer_id FROM customer WHERE customer_email=?", req.tokenEmail, function (err, data) {
			if (err) {
				reject(err)
			}
			else {
				let bookingFare = Math.floor((Math.random() * (300 - 80)) + 80);
				req.customerID = data[0].customer_id;
				db.query("INSERT INTO booking(customer_id,source_address,destination_address,source_lat,source_long,destination_lat,destination_long,booking_fare) VALUES (?,?,?,?,?,?,?,?)", [data[0].customer_id, req.body.source, req.body.destination, req.sourceLatLong[0], req.sourceLatLong[1], req.destinationLatLong[0], req.destinationLatLong[1], bookingFare], (err, status) => {
					if (err) {
						reject(err)
					}
					else {
						resolve(status);
					}
				});
			}
		});
	})
}

function getBookingDetail(customerID) {
	return new Promise(function (resolve, reject) {
		db.query("SELECT booking_id, customer_id, source_address, destination_address,created_at FROM booking WHERE customer_id=? AND booking_status=0", customerID, function (err, result) {
			if (err) {
				reject(err)
			}
			else {
				resolve(result)
			}
		});
	})
}

function getcustomerDetailsByEmail(email) {
	return new Promise((resolve, reject) => {
		db.query("SELECT customer_id, customer_name ,customer_email FROM customer WHERE customer_email= ? ", email, (err, data) => {
			if (err) {
				reject()
			}
			else {
				resolve(data[0])
			}
		})
	})
}

function updateBookingTable(bookingID, driverRating) {
	return new Promise((resolve, reject) => {
		db.query("UPDATE booking SET booking_status = ?,driver_rating=?, completed_at=? WHERE booking_id=?", [2, driverRating, new Date().toJSON().slice(0, 19).replace('T', ' '), bookingID], (err, detail) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(detail)
			}
		})
	})
}

function fetchDriverStatus(bookingID) {
	return new Promise((resolve, reject) => {
		db.query("SELECT driver_id,booking_fare from booking WHERE booking_id=?", [bookingID], (err, data) => {
			if (err) {
				reject()
			}
			else {
				resolve(data[0])
			}
		})
	})
}


function checkAvailableBooking(customerID) {
	return new Promise((resolve, reject) => {
		db.query("SELECT booking_id FROM booking WHERE customer_id=? AND booking_status=?", [customerID, 1], (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(data[0])
			}
		})
	});
}



function setStatusOfDriver(driver) {
	return new Promise((resolve, reject) => {
		db.query("UPDATE driver SET driver_status=? WHERE driver_id=? AND driver_status = ?", [0, driver.driver_id, 1], (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve('complete')
			}
		})
	})
}

function getcustomerID(email) {
	return new Promise((resolve, reject) => {
		db.query("SELECT customer_id FROM customer WHERE customer_email=?", email, (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(data[0].customer_id)
			}
		})
	})
}

function getcustomerBookingDetails(customerID) {
	return new Promise((resolve, reject) => {
		db.query("SELECT customer.customer_id, customer.customer_email, customer.customer_phone, booking.booking_id, booking.created_at, booking.driver_id, booking.booking_fare, booking.source_address, booking.destination_address FROM customer INNER JOIN booking on customer.customer_id= booking.customer_id WHERE customer.customer_id=? AND booking.booking_status=2", customerID, (err, detail) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(detail);
			}
		})
	});
}

function cancelBooking(bookingID){
	return new Promise((resolve, reject)=>{
		db.query("UPDATE booking SET booking_status=3 WHERE booking_id=?",bookingID,(err,data)=>{
			if(err){
				reject(err)
			}
			if(data.affectedRows <1){
				resolve(false);
			}
			else{
				resolve(true);
			}
		})
	});
}

function addRatingsOnDriver(req, res, driverID) {
	return new Promise((resolve, reject) => {
		db.query("UPDATE driver SET driver_rating =? WHERE driver_id=?", [req.body.driverRating, driverID], (err, details) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(details)
			}
		});
	});
}
