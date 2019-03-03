const db = require('../database/mysqlLib')

//All function exports
module.exports.insertDriver = insertDriver;
module.exports.getDriverHash = getDriverHash;
module.exports.getDriverId = getDriverId;

//All function definitioins

function insertDriver(req, res){
	db.query("INSERT INTO driver(driver_email, driver_name,driver_phone, driver_licence,driver_car_number ,password_hash) VALUES (?,?,?,?,?,?)", [req.body.email, req.body.name, req.body.phone, req.body.driverLicence, req.body.carNumber, req.hash], (err, detail) => {
		if (err) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SERVER_ERROR,
				error: err.message,
				message: "Some error occurred"
			});
		}
		else {
			db.query("SELECT driver_id,driver_name,driver_email,driver_car_number FROM driver WHERE driver_email=?", req.body.email, function (err, data) {
				if (err) {
					res.send({
						statusCode: CONSTANTS.responseStatusCode.SERVER_ERROR,
						error: err.message,
						message: "Some error occurred"
					});
				}
				else {
					res.send({
						statusCode: 200,
						message: 'Driver inserted successfully in database',
						data: {
							"driver_id": data[0].driver_id,
							"driver_name": data[0].driver_name,
							"driver_email": data[0].driver_email,
							"driver_car_number": data[0].driver_car_number
						}
					});
				}
			})
		}
	})
}

function getDriverHash(req, res){
	return new Promise(function (resolve, reject) {
		db.query("SELECT password_hash FROM driver WHERE driver_email=?", req.body.email, function (err, data) {
			if (err) {
				reject('err')
			}
			else {
				resolve(data[0]);
			}
		})
	})
}

function getDriverId(email){
	return new Promise((resolve, reject) => {
		db.query("SELECT driver_id FROM driver WHERE driver_email=?", email, (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(data[0])
			}
		})
	})
}

