const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { listingController } = require('../controllers/index.js');
const { middlewareCheckToken } = require('../config/jwt.js');
const { uploadCloud } = require('../config/uploadCloudinary.js');

const routes = express.Router();

routes.get('/', handleErrorRoutes(listingController.getListing)); // getSaveListing

routes.get('/listing-by-address', handleErrorRoutes(listingController.getListByAddress));

routes.get('/:id', handleErrorRoutes(listingController.getListingById));

routes.post('/upload-imgs', handleErrorRoutes(middlewareCheckToken), uploadCloud.any(), handleErrorRoutes(listingController.uploadImgsListing));

routes.post('/add-list', handleErrorRoutes(middlewareCheckToken), uploadCloud.any() ,handleErrorRoutes(listingController.addList));

routes.put('/:id', handleErrorRoutes(middlewareCheckToken), uploadCloud.any(), handleErrorRoutes(listingController.updateListingById))

routes.delete('/:id', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(listingController.deleteListing));



module.exports = {
    routes
};