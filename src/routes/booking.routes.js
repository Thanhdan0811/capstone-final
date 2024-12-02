const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { bookingController } = require('../controllers/index.js');
const { middlewareCheckToken } = require('../config/jwt.js');

const routes = express.Router();

routes.post('/create',handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(bookingController.createBooking))

routes.get('/', handleErrorRoutes(bookingController.getAllBookings));

routes.get('/get-by-user-id/:id', handleErrorRoutes(bookingController.getBookingByUserBookingId))

routes.get('/:id', handleErrorRoutes(bookingController.getBookingById))

routes.put('/:id', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(bookingController.uploadBooking))

routes.delete('/:id', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(bookingController.deleteBooking));

module.exports = {
    routes
};

/* 
getAllBookings
getBookingById
createBooking
updateBooking
deleteBooking
getBookingByUserBookingId

*/