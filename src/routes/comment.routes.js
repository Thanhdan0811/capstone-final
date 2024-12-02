const express = require('express');
const { handleErrorRoutes } = require('../utils/index.js');
const { commentController } = require('../controllers/index.js');
const { middlewareCheckToken } = require('../config/jwt.js');

const routes = express.Router();

routes.get('/', handleErrorRoutes(commentController.getAllComments));

routes.get('/comments-by-listing-id/:id', handleErrorRoutes(commentController.getCommentsByListingId));

routes.post('/create', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(commentController.createcomment));

routes.put('/:id', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(commentController.updateComment));

routes.delete('/:id', handleErrorRoutes(middlewareCheckToken), handleErrorRoutes(commentController.deleteComment));

module.exports = {
    routes
};