//Require npm modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//Global modules
global.CONSTANTS = require('./constants/constants');
global.CONFIG = require('./config/config');
global.Promise = require('bluebird');
global.connection = require('./database/mysqlLib');

//Application miiddlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Require modules
const adminService = require('./services/adminService');
const customerRouter = require('./routers/customerRouter');
const adminRouter = require('./routers/adminRouter');
const driverRouter = require('./routers/driverRouter');

/*
 *
 *	BOOKING STATUS ->  	0 : PENDING, 
												1 : DRIVER_ASSIGNED, 
												2 : COMPLETED, 
												3	:	CANCELLED 
 											
 *	DRIVER STATUS  ->  	0 : FREE, 
												1 : ASSIGNED, 
												2 : NOT_AVAILABLE
 *
*/

//Router middlewares
app.use('/customer', customerRouter);
app.use('/admin', adminRouter);
app.use('/driver', driverRouter);

app.listen(CONFIG.PORT, function (err) {
	if (err) {
		console.log(err.message);
	}
	else {
		Promise.coroutine(function* () {
			const check = yield adminService.checkDatabaseEmpty()
			if (check[0] == undefined) {
				let result = yield adminService.insertIntoDatabase()
			}
			console.log("Server listening at Port : " + CONFIG.PORT)
		})().catch((err) => {
			console.log(err);
		})
	}
})