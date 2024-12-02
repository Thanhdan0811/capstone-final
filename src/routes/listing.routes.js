const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { listingController } = require('../controllers/index.js');
const { middlewareCheckToken } = require('../config/jwt.js');
const { uploadCloud } = require('../config/uploadCloudinary.js');

const routes = express.Router();


/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all listings
 *     description: Retrieve all listings with pagination.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (optional, default 1)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: size
 *         in: query
 *         description: Number of items per page (optional, default 10)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                         format: float
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request
 */
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