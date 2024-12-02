const express = require('express');
const dotenv = require('dotenv');
const { routes } = require('./src/routes/index.js');
const db = require('./src/db/index.js');
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger.js");

const { connectDB } = db;

dotenv.config();
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/swagger-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(routes);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err?.status || 400).json({message: err.message, data: null});
})

app.listen(process.env.PORT || 3002, async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("connect db error: ", error);
        process.exit(1);
    }
    console.log(`Server listening on port ${process.env.PORT || 3002}`)
})
