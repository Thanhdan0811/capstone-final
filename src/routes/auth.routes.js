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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               birth_date:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               type:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 0 is guest, 1 is owner.
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request.
 */
routes.post('/register', handleErrorRoutes(authController.register))

routes.post('/login', handleErrorRoutes(authController.login))


module.exports = {
    routes
};