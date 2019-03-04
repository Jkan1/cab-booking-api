const Joi = require('joi');

//All function exports
module.exports.signupInputValidate = signupInputValidate;
module.exports.loginInputValidate =loginInputValidate;
module.exports.customerRatingsValidate = customerRatingsValidate;

//Schema declarations
const customerSignupSchema = {
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().regex(/[0-9]{10}/).required(),
	password: Joi.string().min(6).max(30).required(),
	confirmPassword: Joi.any().valid(Joi.ref('password'))
}

const customerLoginSchema = {
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(30).required(),
}

const customerRatingsSchema = {
	token: Joi.required(),
	driverRating : Joi.number().min(1).max(5).required()
}

//All function definitions

function signupInputValidate(req, res, next) {
	Joi.validate(req.body, customerSignupSchema, (err, val) => {
		if (err) {
			res.json({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.details[0].message,
				message: "Invalid input"
			});
		}
		else {
			next();
		}
	})
}

function	loginInputValidate(req, res, next) {
	Joi.validate(req.body, customerLoginSchema, (err, val) => {
		if (err) {
			res.json({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.message,
				message: "Invalid input"
			});
		}
		else {
			next();
		}
	})
}

function customerRatingsValidate(req, res, next) {
	Joi.validate(req.body, customerRatingsSchema, (err, val) => {
		if (err) {
			res.json({
				statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
				error: err.details[0].message,
				message: "Invalid input"
			});
		}
		else {
			next();
		}
	})
}