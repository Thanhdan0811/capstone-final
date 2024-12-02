const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { userController } = require('../controllers/index.js');
const { middlewareCheckToken } = require('../config/jwt.js');

const { uploadCloud } = require('../config/uploadCloudinary.js');


const routes = express.Router();

routes.get('/',  handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(userController.getAllUsers))

routes.get('/search-user-by-name', handleErrorRoutes(middlewareCheckToken),handleErrorRoutes(userController.searchUserByName))

routes.get('/:id', handleErrorRoutes(middlewareCheckToken),handleErrorRoutes(userController.getUserById))

routes.post('/create-user', handleErrorRoutes(middlewareCheckToken),handleErrorRoutes(userController.createUserByAdmin))

routes.put('/:id', handleErrorRoutes(middlewareCheckToken), uploadCloud.single("avartar"),handleErrorRoutes(userController.updateUser));

routes.delete('/:id',  handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(userController.deleteUserById))

module.exports = {
    routes
};