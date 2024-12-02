const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Backend Node 44 - AIRBNB - Nguyễn Thanh Dân",
    version: "1.0.0",
    description: "AIRBNB - DAN API Description",
  },
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
