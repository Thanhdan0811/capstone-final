const authController = require("./auth/auth.controller.js");
const listingController = require("./listing/listing.controller.js");
const userController = require("./user/user.controller.js");
const bookingController = require("./booking/booking.controller.js");
const commentController = require("./comment/comment.controller.js");

module.exports = {
    authController,
    listingController,
    userController,
    bookingController,
    commentController,
}