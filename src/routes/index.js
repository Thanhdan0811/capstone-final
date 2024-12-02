const express =  require('express');
const {routes: authRoutes} =  require('./auth.routes.js');
const {routes: listingRoutes} =  require('./listing.routes.js');
const {routes: userRoutes} =  require('./user.routes.js');
const {routes: bookingRoutes} =  require('./booking.routes.js');
const {routes: commentRoutes} =  require('./comment.routes.js');

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/listing', listingRoutes);
routes.use('/users', userRoutes);
routes.use('/booking', bookingRoutes);
routes.use('/comment', commentRoutes);

module.exports = {
    routes
};