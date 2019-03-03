const router = require('express').Router();
const adminController = require('../controllers/adminController');
const adminAuthorization = require('../validators/adminAuthorization');

//Export router object
module.exports = router;

//Defining '/admin' routes
router.post('/login', adminAuthorization.hashToPasswordCheck, adminController.adminLoginDetails);
router.post('/view-free-drivers', adminAuthorization.hashToPasswordCheck, adminController.viewFreeDrivers);
router.post('/view-pending-bookings', adminAuthorization.hashToPasswordCheck, adminController.viewPendingBookings);
router.post('/driver-assign', adminAuthorization.hashToPasswordCheck, adminController.assignDriver);
router.get('/close-connection', adminController.closeDbConnection);
router.get('/logout', adminController.adminLogout);
