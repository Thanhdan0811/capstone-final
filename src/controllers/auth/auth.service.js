const bcrypt = require("bcrypt");

const db = require("../../db/index.js");
const { DB_CONST } = require("../../constants/index.js");
const { createToken } = require("../../config/jwt.js");
const { findUserFromEmail } = require("../user/user.service.js");



const models = db.models;
const DB_NAME = DB_CONST.DB_NAME;

exports.registerService = async ({name, email, password, phone, birth_date, gender, type}) => { 
    const USER_DB = await models[DB_NAME.USER];
    const user = await findUserFromEmail(email);
    if (user) {
        throw {message: "user existed", status: 403};
    }
    if (!name || !phone) throw {message: "User must hast name, phone", status: 403};
    const passHash = bcrypt.hashSync(password, 10);
    await USER_DB.create({
        name, 
        email, 
        password: passHash,
        phone, 
        birth_date,
        gender,
        type,
    })
}

exports.loginService = async ({email, password}) => {
    const user = await findUserFromEmail(email);
    if (!user) throw {message: "email/password not valid", status: 403};
    const checkPass = bcrypt.compareSync(password, user.password);
    if (!checkPass) throw {message: "email/password not valid", status: 403};
    const accessToken = createToken({user_id: user.id})
    return {accessToken}
}