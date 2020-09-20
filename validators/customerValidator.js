const Joi = require('joi');

//Schema declarations
const customerSignupSchema = Joi.object().keys({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().regex(/[0-9]{10}/).required(),
	password: Joi.string().min(6).max(30).required(),
	confirmPassword: Joi.any().valid(Joi.ref('password'))
});

const customerLoginSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(30).required(),
});

const customerRatingsSchema = Joi.object().keys({
	token: Joi.required(),
	driverRating: Joi.number().min(1).max(5).required()
});

//All function definitions

const signupInputValidate = (req, res, next) => {
	let valid = customerSignupSchema.validate(req.body);
	if (valid.error) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: valid.error.details[0].message,
			message: "Invalid input"
		});
	}
	else {
		next();
	}
}

const loginInputValidate = (req, res, next) => {
	let valid = customerLoginSchema.validate(req.body);
	if (valid.error) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: valid.error.details[0].message,
			message: "Invalid input"
		});
	}
	else {
		next();
	}
}

const customerRatingsValidate = (req, res, next) => {
	let valid = customerRatingsSchema.validate(req.body);
	if (valid.error) {
		res.json({
			statusCode: CONSTANTS.responseStatusCode.SHOW_ERROR_MESSAGE,
			error: valid.error.details[0].message,
			message: "Invalid input"
		});
	}
	else {
		next();
	}
}

//All function exports
module.exports.signupInputValidate = signupInputValidate;
module.exports.loginInputValidate = loginInputValidate;
module.exports.customerRatingsValidate = customerRatingsValidate;