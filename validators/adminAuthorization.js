//Require npm modules
const Promise = require('bluebird')
const bcrypt = require('bcrypt')
const saltRounds = 10;

//Require custom module
const adminService = require('../services/adminService')

//All function definitions

const generateHash = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					reject(err)
				}
				else {
					resolve(hash)
				}
			});
		});
	})
}

const hashToPasswordCheck = async (req, res, next) => {
	let hash = await adminService.getHashValue(req.body.email)
	if (hash == undefined) {
		res.send({
			statusCode: CONSTANTS.responseStatusCode.EMAIL_NOT_EXISTS,
			error: "admin not found",
			message: "Admin not found"
		});
	}
	else {
		bcrypt.compare(req.body.password, hash.password_hash, (err, match) => {
			if (err) {
				res.send({
					statusCode: CONSTANTS.responseStatusCode.WRONG_PASSWORD,
					error: err.message,
					message: "Some error occurred"
				});
			}
			else {
				if (match) {
					next()
				}
				else {
					res.send({
						statusCode: CONSTANTS.responseStatusCode.WRONG_PASSWORD,
						error: "wrong password",
						message: "Wrong password"
					});
				}
			}
		})
	}
}

//All function exports
module.exports.generateHash = generateHash;
module.exports.hashToPasswordCheck = hashToPasswordCheck;