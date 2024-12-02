const db = require("../../db/index.js");
const { DB_CONST } = require("../../constants/index.js");
const { createToken, getUserIdFromToken } = require("../../config/jwt.js");
const { where, Op } = require("sequelize");

const models = db.models;
const DB_NAME = DB_CONST.DB_NAME;

const validFields = [
  "name",
  "capacity",
  "description",
  "price_per_night",
  "status",
  "address",
  "street",
  "city",
];

exports.findUserFromEmail = async (email) => {
  const USER_DB = models[DB_NAME.USER];
  return await USER_DB.findOne({
    where: {
      email,
    },
  });
};

exports.findUserFromUserId = async (userId) => {
  const USER_DB = models[DB_NAME.USER];
  return await USER_DB.findByPk(userId);
};

exports.getAllUsers = async ({ page = 1, size = 10 }) => {
  const USER_DB = models[DB_NAME.USER];
  const offset = (+page - 1) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
  const users = await USER_DB.findAndCountAll({
    limit: +size,
    offset: offset,
    attributes: {
      exclude: ["deleted"],
    },
    where: {
      deleted: false,
    },
  });

  // imgs_url when get is JSON type, need to parse
  return users;
};

exports.createUserByAdmin = async (user_id, body) => {
  const user = exports.findUserFromUserId(user_id);
  if (!user) throw { message: "Unauthorized", status: 403 };
  // true means admin, only admin can create user (owwner or guest).
  if (!user.role) throw { message: "Unauthorized", status: 403 };

  const USER_DB = await models[DB_NAME.USER];
  const {
    name,
    email,
    password,
    phone,
    birth_date = "",
    gender = "",
    type,
    avartar = "",
  } = body;
  const userCreated = await exports.findUserFromEmail(email);
  if (userCreated) {
    throw { message: "User existed", status: 403 };
  }
  if (!name || !phone)
    throw { message: "User must hast name, phone", status: 403 };

  const passHash = bcrypt.hashSync(password, 10);
  await USER_DB.create({
    name,
    email,
    password: passHash,
    phone,
    birth_date,
    gender,
    type,
  });
};

exports.updateUser = async (token_id, params, body, files) => {
  const { id: user_id } = params;
  const token = await exports.findUserFromUserId(token_id);
  const user = await exports.findUserFromUserId(user_id);
  if (!user) throw { message: "Unauthorized", status: 403 };
  // true means admin, admin can update (owwner or guest).
  // true if id from token === id from user.
  if (!token.role && token.id !== user.id)
    throw { message: "Unauthorized", status: 403 };

  const { name, password = "", birth_date = "", gender = "" } = body;

  const avartar = files[0]?.path || "";

  const dataUpdate = {
    name: name ?? user.name,
    birth_date: birth_date ?? user.birth_date,
    gender: gender ?? user.gender,
    avartar: avartar || user.avartar,
  };

  if (password) {
    const passHash = bcrypt.hashSync(password, 10);
    dataUpdate.password = passHash;
  }

  const updatedUser = await user.udpate({ ...dataUpdate });
  return { ...updatedUser.get() };
};

exports.getUserById = async (params) => {
    const { id : user_id } = params;
    if (!user_id) throw { message: "Unauthorized", status: 403 };
    const user = await exports.findUserFromUserId(user_id);
    if (!user) throw { message: "User not found!!", status: 403 };

    return user;

}

exports.deleteUserById = async (token_id, params) => {
    const { id : user_id } = params;
    const userToken = await exports.findUserFromUserId(token_id);
    const user = await exports.findUserFromUserId(user_id);
    if (!user) throw { message: "Unauthorized", status: 403 };
    // true means admin, admin can update (owwner or guest).
    // true if id from token === id from user.
    if (!userToken.role && userToken.id !== user.id)
    throw { message: "Unauthorized", status: 403 };

    await user.udpate({
        delete: true,
    })
}

exports.searchUserByName = async (query) => {
    const { name = '', page = 1, size = 10 } = query || {};
    const USER_DB = models[DB_NAME.USER];
    const offset = (+page - 1) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
    const users = await USER_DB.findAndCountAll({
        limit: +size,
        offset: offset,
        attributes: {
        exclude: ["deleted"],
        },
        where: {
            deleted: false,
            [Op.like]: {
                name: `%${name}%`,
            }
        },
    });

    // imgs_url when get is JSON type, need to parse
    return users;
}