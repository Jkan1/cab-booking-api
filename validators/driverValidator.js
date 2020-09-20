const Joi = require('joi')

//Schema declarations

const driverSignupSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().max(256).required(),
    phone: Joi.string().regex(/[0-9]{10,15}/).required(),
    carNumber: Joi.string().min(6).max(12).required(),
    driverLicence: Joi.string().min(8).max(20).required(),
    password: Joi.string().min(6).max(50).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password'))
});
const driverLoginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
});

//Function definitions

const signupInputValidation = (req, res, next) => {
    let valid = driverSignupSchema.validate(req.body);
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

const loginInputValidation = (req, res, next) => {
    let valid = driverLoginSchema.validate(req.body);
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

//Function exports
module.exports.signupInputValidation = signupInputValidation
module.exports.loginInputValidation = loginInputValidation;