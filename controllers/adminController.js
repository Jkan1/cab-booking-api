const adminService = require('../services/adminService')
const Logging = require('../logs/logging')

//All function exports
module.exports.viewFreeDrivers = viewFreeDrivers;
module.exports.viewPendingBookings = viewPendingBookings;
module.exports.assignDriver = assignDriver;
module.exports.adminLoginDetails = adminLoginDetails;
module.exports.closeDbConnection = closeDbConnection;
module.exports.adminLogout = adminLogout;

//All function definitions
const closeDbConnection = (req, res) => {
	Promise.coroutine(function* () {
		let resolvedMessage = yield adminService.closeConnection();
	})().then(() => {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
			message: 'Database connection closed'
		});
	}).catch((err) => {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.CONNECTION_CLOSED,
			error: err.message,
			message: 'Database connection already ended.'
		})
	});
}

const adminLoginDetails = async (req, res) => {
	let getAdminDetals = await adminService.fetchAdminDetails(req.body.email)
	if (getAdminDetals == undefined) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: "failed to fetch admin details",
			message: 'Failed to fetch admin details'
		});
	}
	else {
		res.send({
			statusCode: CONSTANTS.responseStatusCode.LOGIN_SUCCESSFULLY,
			message: 'Login successfull',
			data: {
				admin_id: getAdminDetals.admin_id,
				admin_name: getAdminDetals.admin_name,
				admin_created_at: getAdminDetals.created_at
			}
		})
	}
}

const viewFreeDrivers = async (req, res) => {
	let viewDrivers = await adminService.fetchFreeDriversByRatings()
	if (viewDrivers[0] == undefined) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.NO_DATA_FOUND,
			error: "drivers not found",
			message: 'Drivers not found'
		});
	}
	else {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
			message: 'Drivers fetch succesfull',
			data: viewDrivers
		});
	}
}

const viewPendingBookings = async (req, res) => {
	let pendingBookings = await adminService.fetchPendingBookings()
	if (pendingBookings[0] == undefined) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.NO_DATA_FOUND,
			error: "bookings not found with status pending",
			message: 'No pending booking found'
		});
	}
	else {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
			message: 'Bookings fetch succesfull',
			data: pendingBookings
		});
	}
}

const assignDriver = async (req, res) => {
	try {
		const availableDriverStatus = await adminService.getAvailableDriverCheck(req.body.driverID);
		if (availableDriverStatus == undefined) {
			res.json({
				statusCode: CONSTANTS.responseStatusCode.NO_DATA_FOUND,
				error: "Driver not found",
				message: 'Driver not found'
			});
		}
		if (availableDriverStatus.driver_status != 0) {
			res.json({
				statusCode: CONSTANTS.responseStatusCode.NOT_AVAILABLE,
				error: "driver status not free",
				message: 'Driver not free'
			});
		}
		else {
			const insertDriver = await adminService.assignDriver(req.body.driverID, req.body.bookingID);
			if (insertDriver.affectedRows < 1) {
				res.json({
					statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
					error: "booking not available",
					message: 'Booking not available'
				});
			}
			else {
				const updateDriverStatus = await adminService.updateDriverStatus(req.body.driverID)
				if (updateDriverStatus.affectedRows < 1) {
					res.json({
						statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
						error: "failed to update driver status",
						message: 'Driver status not updated'
					});
				}
				else {
					const allBookingDetail = await adminService.allBookingDetail(req.body.bookingID);
					if (allBookingDetail == undefined) {
						res.json({
							statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
							error: "failed to fetch all booking details",
							message: 'Some error occured'
						});
					}
					const createLogs = await Logging.createBookingLog(req, res, allBookingDetail)
					res.send({
						statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
						message: "Driver assigned succesfully",
						data: {
							"booking_id": req.body.bookingID,
							"driver_id": req.body.driverID,
							"driver_name": availableDriverStatus.driver_name,
							"driver_phone": availableDriverStatus.driver_phone,
							"driver_car_number": availableDriverStatus.driver_car_number
						}
					})
				}
			}
		}
	}
	catch (err) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.SERVER_ERROR,
			error: err.message,
			message: 'Logs not created'
		});
	}
}

const adminLogout = (req, res) => {
	//DELETE ADMIN TOKEN
	res.json({
		statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
		message: 'Logout succesfull'
	});
}