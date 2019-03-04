const Promise = require('bluebird');
const mongo = require('../database/mongoLib')

//All function definitions

function createBookingLog(req, res, details){
	return new Promise((resolve, reject) => {
		const logSchema = {
			"booking id": req.body.bookingID,
			"user_id": details.user_id,
			"driver_id": details.driver_id,
			"driver_car_number": details.driver_car_number,
			"journey_details": {
				"booking_source": details.source_address,
				"booking_destination": details.destination_address
			},
			"booking_created_at": details.created_at,
			"booking_status": details.booking_status,
			"booking_completed_at": details.completed_at
		}
		mongo.dbo.collection(CONFIG.mongoCred.COLLECTION).insertOne(logSchema, (err, result) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(result)
			}
		})
	})
}

function printBookingsOfDriver(driverID){
	return new Promise((resolve, reject) => {
		mongo.dbo.collection(CONFIG.mongoCred.COLLECTION).find({ "driver_id": driverID.toString() }).toArray(function (err, val) {
			if (err) {
				reject(err)
			}
			else {
				resolve(val)
			}
		})
	})
}

//Export all functions
module.exports.createBookingLog = createBookingLog;
module.exports.printBookingsOfDriver = printBookingsOfDriver;