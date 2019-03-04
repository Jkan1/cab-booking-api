const Joi = require('joi')

//Function exports
module.exports.signupInputValidation = signupInputValidation
module.exports.loginInputValidation = loginInputValidation;

//Schema declarations

const driverSignupSchema = {
    name: Joi.string().required(),
    email: Joi.string().email().max(256).required(),
    phone: Joi.string().regex(/[0-9]{10,15}/).required(),
    carNumber: Joi.string().min(6).max(12).required(),
    driverLicence: Joi.string().min(8).max(20).required(),
    password: Joi.string().min(6).max(50).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password'))
}
const driverLoginSchema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
}

//Function definitions

const signupInputValidation = (req, res, next) => {
    Joi.validate(req.body, driverSignupSchema, (err, value) => {
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

const loginInputValidation = (req, res, next) => {
    Joi.validate(req.body, driverLoginSchema, (err, value) => {
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
