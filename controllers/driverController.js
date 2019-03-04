const db = require('../database/mysqlLib')
const driverService = require('../services/driverService')
const mongoLogs = require('../logs/logging')

//All function exports
module.exports.driverLogin = driverLogin;
module.exports.viewBookings = viewBookings;
module.exports.driverLogout = driverLogout;

//All function definitions

const driverLogin = (req, res) => {
	db.query("SELECT driver_id, driver_name , driver_email, driver_phone, driver_car_number FROM driver WHERE driver_email= ?", req.body.email, function (err, data) {
		if (err) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.message,
				message: "Some error occurred"
			});
		}
		else {
			res.send({
				statusCode: 200,
				message: "Login successfull",
				data:
				{
					"driver_id": data[0].driver_id,
					"driver_name": data[0].driver_name,
					"driver_email": data[0].driver_email,
					"driver_phone": data[0].driver_phone,
					"driver_id": data[0].driver_car_number,
					"token": req.token
				}
			});
		}
	})
}

const viewBookings = async (req, res) => {
	try {
		let driverId = await driverService.getDriverId(req.driverEmail);
		if (driverId == undefined) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: 'driver id not found',
				message: "Some error occurred"
			});
		}
		else {
			let checkBookingMongo = await mongoLogs.printBookingsOfDriver(driverId.driver_id)
			res.send({
				statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
				message: "Driver detail fetch successfull",
				data: checkBookingMongo
			});
		}
	}
	catch (err) {
		res.send({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: err.message,
			message: "Some error occurred"
		});
	}
}

const driverLogout = (req, res) => {
	res.send({
		statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
		message: "Logout successful",
		data: {
			driver_email: req.driverEmail
		}
	});
}
