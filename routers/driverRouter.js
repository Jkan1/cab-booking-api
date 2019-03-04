const express = require('express');
const router = express.Router();
const driverService= require('../services/driverService')
const driverController = require ('../controllers/driverController');
const driverValidator = require('../validators/driverValidator')
const driverAuthorization = require('../validators/driverAuthorization')

//Export router object
module.exports= router

//Define '/driver' routes
router.post('/signup',     driverValidator.signupInputValidation,              driverAuthorization.passwordToHash,               driverService.insertDriver)       
router.post('/login',      driverValidator.loginInputValidation,              driverAuthorization.checkLoginCredential,          driverAuthorization.hashToPassword,               driverAuthorization.generateToken,                 driverController.driverLogin)
router.post('/view-bookings',  driverAuthorization.validateToken    ,    driverController.viewBookings);
router.post('/logout', driverAuthorization.validateToken            ,   driverController.driverLogout);
