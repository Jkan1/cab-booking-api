const router = require('express').Router();
const customerService = require('../services/customerService');
const customerController = require('../controllers/customerController');
const customerValidator = require('../validators/customerValidator');
const customerAuthorization = require('../validators/customerAuthorization');

//Export router object
module.exports = router;

//Define '/customer' routes
router.post('/signup', customerValidator.signupInputValidate, customerAuthorization.passwordToHash, customerService.addSignup);
router.post('/login', customerValidator.loginInputValidate, customerAuthorization.checkCredentials, customerAuthorization.generateToken, customerService.fetchLoginDetails);
router.post('/create-booking', customerAuthorization.validateToken, customerController.createBooking);
router.post('/view-bookings', customerAuthorization.validateToken, customerController.viewBooking);
router.post('/booking-complete', customerAuthorization.validateToken, customerController.completeBooking);
router.post('/logout',customerAuthorization.validateToken, customerController.customerLogout)