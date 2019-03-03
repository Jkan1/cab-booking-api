const bcrypt = require('bcrypt')
const saltRounds = 10;
const driverService = require('../services/driverService')
const jwt = require('jsonwebtoken')

//All function exports
module.exports.passwordToHash = passwordToHash;
module.exports.checkLoginCredential = checkLoginCredential
module.exports.hashToPassword = hashToPassword
module.exports.generateToken = generateToken
module.exports.validateToken = validateToken

//All function definitions

function passwordToHash(req, res, next){
	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(req.body.confirmPassword, salt, (err, hash) => {
			if (err) {
				res.send({
					statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
					error: err.message,
					message: "Some error occurred"
				});
			}
			else {
				req.hash = hash;
				next();
			}
		});
	});
}

async function checkLoginCredential(req, res, next){
	let hash = await driverService.getDriverHash(req, res);
	if (hash == undefined) {
		res.send({
			statusCode: CONSTANTS.responseStatusCode.INVALID_EMAIL_ID,
			error: "email not found",
			message: "Email not found"
		});
	}
	else {
		req.hash = hash.password_hash;
		next();
	}
}

function hashToPassword(req, res, next){
	bcrypt.compare(req.body.password, req.hash, function (err, check) {
		if (err) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.message,
				message: "Some error occurred"
			});
		}
		else {
			if (check) {
				next()
			}
			else {
				res.send({
					statusCode: CONSTANTS.responseStatusCode.WRONG_PASSWORD,
					warning: "wrong password",
					message: "Wrong password"
				});
			}
		}
	})
}

function generateToken(req, res, next){
	const payLoad = {
		email: req.body.email
	}
	jwt.sign(payLoad, CONFIG.privateKey, (err, token) => {
		if (err) {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.message,
				message: "Some error occurred"
			});
		}
		else {
			req.token = token;
			next();
		}
	});
}

function getEmailByToken(req, res){
	return new Promise((resolve, reject) => {
		jwt.verify(req.body.token, CONFIG.privateKey, (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(data.email)
			}
		})
	})
}

async function validateToken(req, res, next){
	try {
		let email = await getEmailByToken(req, res);
		if (email == '') {
			res.send({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: "email not found in token",
				message: "Some error occurred"
			});
		}
		else {
			req.driverEmail = email;
			next();
		}
	} catch (err) {
		res.send({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: err.message,
			message: "Some error occurred"
		});
	}
}
