const { Sequelize } = require("sequelize");
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require("url");
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';

// const config = (await import(pathToFileURL(path.join(import.meta.dirname, '../config/database.json')), { assert: { type: 'json' } }));



const database = process.env.DB;
const username = process.env.DB_USER;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const password = process.env.DB_PASSWORD || null;
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timestamps: true,
    logging: console.log,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        underscored: true,
    },

}

const sequelize = new Sequelize(database, username, password, options);
const models = {};

// get models define in models folder.
const initDB = async () => {
    // read fodler models, get all sub-folder names ['booking', 'comment', 'listing', 'user'].
    const listPathModels = fs
    .readdirSync(path.resolve(path.join(__dirname, './models')));
    // loop through each sub-folder in folder models, then read index.js
    for(let file of listPathModels) {
        // get path
        const fP = path.resolve(path.join(__dirname, './models/', file, '/index.js'));
        // if existed, then call f function from file,
        if (fs.existsSync(fP)) {
            const f = (await require(fP));
            const model = f(sequelize, Sequelize.DataTypes);
            // save model to glocal variable.
            models[model.name] = model;
        }
    }


    // set associate for model
    Object.values(models).forEach(model => {
    if (model.associate instanceof Function) {
        model.associate(models);
    }
    });

}

// function call to connect to db.
const connectDB = async () => {
    await initDB();

    try {
        const connection = await mysql.createConnection({host, port, user: username, password})
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)
        await sequelize.authenticate();
        console.log('mysql connect successed');
        return sequelize.sync();
    } catch (error) {
        console.error('connect db failed: ', error);
        process.exit();
    }
}

console.log('models', models);

module.exports = {
    models,
    connectDB, 
    sequelize
}
