const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { listingController } = require('../controllers/index.js');
const { middlewareCheckToken } = require('../config/jwt.js');
const { uploadCloud } = require('../config/uploadCloudinary.js');

const routes = express.Router();

/**
 * @swagger
 * /listing:
 *   get:
 *     tags:
 *       - Listings
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

/**
 * @swagger
 * /listing/listing-by-address:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get listings by address
 *     description: Retrieve listings filtered by address, city, and street, with pagination.
 *     parameters:
 *       - name: address
 *         in: query
 *         description: The address to search for.
 *         required: false
 *         schema:
 *           type: string
 *           example: "123 Main St"
 *       - name: city
 *         in: query
 *         description: The city to filter listings by.
 *         required: false
 *         schema:
 *           type: string
 *           example: "New York"
 *       - name: street
 *         in: query
 *         description: The street to filter listings by.
 *         required: false
 *         schema:
 *           type: string
 *           example: "5th Avenue"
 *       - name: page
 *         in: query
 *         description: The page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: size
 *         in: query
 *         description: The number of items per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of listings matching the given parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_count:
 *                   type: integer
 *                   description: Total number of listings found.
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Listing ID
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Listing name
 *                         example: "Luxury Apartment"
 *                       address:
 *                         type: string
 *                         description: Listing address
 *                         example: "123 Main St, New York"
 *       400:
 *         description: Bad request if any query parameter is incorrect.
 *       500:
 *         description: Internal server error.
 */
routes.get('/listing-by-address', handleErrorRoutes(listingController.getListByAddress));

/**
 * @swagger
 * /listing/{id}:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get a listing by ID
 *     description: Retrieve a specific listing by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the listing.
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: A single listing object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Listing ID
 *                   example: 12345
 *                 name:
 *                   type: string
 *                   description: Listing name
 *                   example: "Luxury Apartment"
 *                 address:
 *                   type: string
 *                   description: Listing address
 *                   example: "123 Main St, New York"
 *                 city:
 *                   type: string
 *                   description: City of the listing
 *                   example: "New York"
 *                 description:
 *                   type: string
 *                   description: Detailed description of the listing
 *                   example: "A spacious luxury apartment located in downtown New York."
 *       404:
 *         description: Listing not found.
 *       500:
 *         description: Internal server error.
 */
routes.get('/:id', handleErrorRoutes(listingController.getListingById));

/**
 * @swagger
 * /listing/upload-imgs:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Upload multiple images for a listing
 *     description: Upload multiple images for a specific listing with token authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imgs_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images to be uploaded (multiple files).
 *               listing_id:
 *                 type: string
 *                 description: The ID of the listing to associate the images with.
 *                 example: "12345"
 *     parameters:
 *       - name: tok
 *         in: header
 *         description: JWT token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     responses:
 *       200:
 *         description: Images uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Images uploaded successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image_url:
 *                         type: string
 *                         description: URL of the uploaded image.
 *                         example: "https://example.com/image1.jpg"
 *       400:
 *         description: Bad request, invalid parameters or missing files.
 *       401:
 *         description: Unauthorized, invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
routes.post('/upload-imgs', handleErrorRoutes(middlewareCheckToken), uploadCloud.any(), handleErrorRoutes(listingController.uploadImgsListing));

/**
 * @swagger
 * /listing/add-list:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Add a new listing with images
 *     description: Add a new listing with images and associated details.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the listing.
 *               capacity:
 *                 type: integer
 *                 description: The capacity of the listing.
 *               description:
 *                 type: string
 *                 description: Description of the listing.
 *               price_per_night:
 *                 type: number
 *                 format: float
 *                 description: Price per night for the listing.
 *               status:
 *                 type: string
 *                 enum: [available, booked, inactive]
 *                 description: The current status of the listing.
 *               address:
 *                 type: string
 *                 description: The address of the listing.
 *               street:
 *                 type: string
 *                 description: The street of the listing.
 *               city:
 *                 type: string
 *                 description: The city of the listing.
 *               imgs_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images to be uploaded for the listing (multiple files).
 *     parameters:
 *       - name: tok
 *         in: header
 *         description: JWT token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     responses:
 *       200:
 *         description: Listing added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing added successfully"
 *                 listing:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request, invalid parameters or missing files.
 *       401:
 *         description: Unauthorized, invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
routes.post('/add-list', handleErrorRoutes(middlewareCheckToken), uploadCloud.any() ,handleErrorRoutes(listingController.addList));

/**
 * @swagger
 * /listing/{id}:
 *   put:
 *     tags:
 *       - Listings
 *     summary: Update an existing listing
 *     description: Update the details of an existing listing by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the listing to update
 *         required: true
 *         schema:
 *           type: string
 *       - name: tok
 *         in: header
 *         description: JWT token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the listing.
 *               capacity:
 *                 type: integer
 *                 description: The capacity of the listing.
 *               description:
 *                 type: string
 *                 description: Description of the listing.
 *               price_per_night:
 *                 type: number
 *                 format: float
 *                 description: Price per night for the listing.
 *               status:
 *                 type: string
 *                 enum: [available, booked, inactive]
 *                 description: The current status of the listing.
 *               address:
 *                 type: string
 *                 description: The address of the listing.
 *               street:
 *                 type: string
 *                 description: The street of the listing.
 *               city:
 *                 type: string
 *                 description: The city of the listing.
 *               imgs_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images to be uploaded for the listing (multiple files).
 *     responses:
 *       200:
 *         description: Listing updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing updated successfully"
 *                 listing:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request, invalid parameters or missing files.
 *       401:
 *         description: Unauthorized, invalid or missing token.
 *       500:
 *         description: Internal server error, something went wrong.
 */
routes.put('/:id', handleErrorRoutes(middlewareCheckToken), uploadCloud.any(), handleErrorRoutes(listingController.updateListingById))

/**
 * @swagger
 * /listing/{id}:
 *   delete:
 *     tags:
 *       - Listings
 *     summary: Delete an existing listing
 *     description: Delete the listing by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the listing to delete
 *         required: true
 *         schema:
 *           type: string
 *       - name: tok
 *         in: header
 *         description: JWT token for authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: "your-jwt-token"
 *     responses:
 *       200:
 *         description: Listing deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing deleted successfully"
 *       400:
 *         description: Bad request, invalid parameters or missing token.
 *       401:
 *         description: Unauthorized, invalid or missing token.
 *       404:
 *         description: Listing not found.
 *       500:
 *         description: Internal server error, something went wrong.
 */
routes.delete('/:id', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(listingController.deleteListing));



module.exports = {
    routes
};