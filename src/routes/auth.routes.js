const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { authController } = require('../controllers/index.js');

const routes = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User Register
 *     description: Register a new user.
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 */
routes.post('/register', handleErrorRoutes(authController.register))

routes.post('/login', handleErrorRoutes(authController.login))


module.exports = {
    routes
};