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


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     description: Login for an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test_owner@yopmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 tok:
 *                   type: string
 *                   description: JWT token for authenticated user
 *       400:
 *         description: Invalid credentials.
 *       401:
 *         description: Unauthorized, incorrect email or password.
 */
routes.post('/login', handleErrorRoutes(authController.login))


module.exports = {
    routes
};