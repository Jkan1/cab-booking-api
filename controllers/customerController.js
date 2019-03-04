const mapUtil = require('../utilities/googleMapUtility');
const customerService = require('../services/customerService')

//All function exports
module.exports.createBooking = createBooking;
module.exports.completeBooking = completeBooking;
module.exports.viewBooking = viewBooking;
module.exports.customerLogout = customerLogout;
module.exports.cancelBooking = cancelBooking;

//All function definitions

async function createBooking(req, res) {
	try {
		req.sourceLatLong = await mapUtil.getLatLong(req.body.source);
		req.destinationLatLong = await mapUtil.getLatLong(req.body.destination);
		const customerID = await customerService.getcustomerID(req.tokenEmail)

		const checkExistingPendingBooking = await customerService.checkExistingPendingBooking(customerID)
		if (checkExistingPendingBooking < 0) {
			const insert = await customerService.insertBookingDetails(req, res);
			const getBookingDetail = await customerService.getBookingDetail(customerID);
			if (insert.affectedRows < 1) {
				res.send({
					statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
					error: "not inserted",
					message: "Some error occurred"
				});
			}
			else {
				res.send({
					statusCode: 200,
					message: "Booking successfully created",
					data: {
						"customer_id": req.customerID,
						"booking_id ": getBookingDetail[0].booking_id,
						"source ": getBookingDetail[0].source_address,
						"destination ": getBookingDetail[0].destination_address,
						"message": "Please wait while driver is assigned"
					}
				});
			}
		}
		else{
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: "booking not created because pending booking exists",
				message: "Booking already pending with Booking ID "+checkExistingPendingBooking
			});
		}

	} catch (err) {
		if (err == 'NOT FOUND') {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.NO_DATA_FOUND,
				warning: "location not found",
				message: "Enter correct source and destination"
			});
		}
		else {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.message,
				message: "Some error occurred"
			});
		}
	}
}


async function completeBooking(req, res) {
	try {
		let tokenEmail = req.tokenEmail;
		let getcustomerDetailsByEmail = await customerService.getcustomerDetailsByEmail(tokenEmail);
		if (getcustomerDetailsByEmail == undefined) {
			res.send({
				"statusCode": 201,
				"error": "email not found",
				"messsage": "email does not exist"
			});
		}
		else {
			const checkAvailableBooking = await customerService.checkAvailableBooking(getcustomerDetailsByEmail.customer_id);
			if (checkAvailableBooking == undefined) {
				res.send({
					statusCode: 201,
					"message": "No driver is assigned yet"
				});
			}
			else {
				let updateBookingTable = await customerService.updateBookingTable(checkAvailableBooking.booking_id, req.body.driverRating);
				if (updateBookingTable.affectedRows < 1) {
					res.send({
						statusCode: 201,
						"message": "Booking not updated"
					});
				}
				else {
					let driverDetails = await customerService.fetchDriverStatus(checkAvailableBooking.booking_id);
					if (driverDetails == undefined) {
						res.send({
							statusCode: 201,
							error: "no driver found in booking"
						});
					}
					else {
						let setStatusOfDriver = await customerService.setStatusOfDriver(driverDetails)
						if (setStatusOfDriver == undefined) {
							res.send({
								statusCode: 201,
								error: 'driver status update failed',
								message: "Driver status updation failed"
							})
						}
						else {
							let putRatings = await customerService.addRatingsOnDriver(req, res, driverDetails.driver_id)
							res.send({
								statusCode: 200,
								"message": "Booking completed succesfully",
								data: {
									"booking_id": driverDetails.booking_id,
									"driver_id": driverDetails.driver_id,
									"booking_fare": driverDetails.booking_fare,
									"customer_id ": getcustomerDetailsByEmail.customer_id,
									"customer_name": getcustomerDetailsByEmail.customer_name,
									"customer_email": getcustomerDetailsByEmail.customer_email,
								}
							})
						}
					}
				}
			}
		}
	}
	catch (err) {
		res.send({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: "not inserted",
			message: "Some error occurred"
		});
	}
}

async function viewBooking(req, res) {
	try {
		let email = req.tokenEmail;
		let customerID = await customerService.getcustomerID(email);
		let customerBookingData = await customerService.getcustomerBookingDetails(customerID);
		res.send({
			statusCode: 200,
			message: "Customer booking details",
			data: customerBookingData
		});
	}
	catch (err) {
		res.send({
			statusCode: 400,
			message: "No bookings found"
		});
	}
}

async function cancelBooking(req,res){
	try{
		const cancelBooking = await customerService.cancelBooking(req.body.bookingID);
		if(cancelBooking === false){
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error:	"Unable to update booking status (cancel)",
				message: "Unable to cancel booking"
			});
		}else if(cancelBooking === true){
			res.send({
				statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
				message: "Booking with Booking ID "+req.body.bookingID+" cancelled succesfully"
			});
		}
	}catch(err){
		res.send({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error:	err.message,
			message: "Unable to cancel booking"
		});
	}
}

async function customerLogout(req, res) {
	//DELETE TOKEN SAVED IN SESSION 
	res.send({
		statusCode: CONSTANTS.responseStatusCode.ACTION_COMPLETE,
		message: "Logout succesfull",
		data: {
			customer_email: req.tokenEmail
		}
	});
}