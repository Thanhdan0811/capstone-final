'use strict';
const { Model, STRING } = require('sequelize');
const { DB_CONST } = require("../../../constants/index.js");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models[DB_CONST.DB_NAME.LISTING], { foreignKey: 'user_owner_id', onDelete: 'CASCADE' })
      User.hasMany(models[DB_CONST.DB_NAME.COMMENT], { foreignKey: 'user_id', onDelete: 'CASCADE' })
      User.hasMany(models[DB_CONST.DB_NAME.BOOKING], {foreignKey: 'user_book_id', onDelete: 'CASCADE'})
      // User.belongsToMany(models['Pin'], { through: 'PinSaved',foreignKey: 'user_id', onDelete: 'CASCADE' })
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      unique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    avartar: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.TINYINT(1), // 1 is admin, 0 is user.
      defaultValue: 0,
    },
    type: {
      type: DataTypes.TINYINT(1), // 1 is owner, 0 is guest.
      allowNull: false,
    },
    // true (1) is available, false (0) deleted user.
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: DB_CONST.DB_NAME.USER,
  });
  return User;
};