"use strict";
const { Model, STRING } = require("sequelize");
const { DB_CONST } = require("../../../constants/index.js");
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Listing.belongsTo(models[DB_CONST.DB_NAME.USER], {
        foreignKey: "user_owner_id",
        onDelete: "CASCADE",
        as: "user_owner",
      });
      Listing.hasMany(models[DB_CONST.DB_NAME.COMMENT], {
        foreignKey: "listing_id",
        onDelete: "CASCADE",
      });
      Listing.belongsTo(models[DB_CONST.DB_NAME.BOOKING], {
        foreignKey: "listing_id",
        onDelete: "CASCADE",
        as: "listing_info",
      });
    }
  }
  Listing.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      price_per_night: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          DB_CONST.LISTING.STATUS.AVAILABLE,
          DB_CONST.LISTING.STATUS.BOOKED,
          DB_CONST.LISTING.STATUS.INACTIVE
        ), // inactive là chỗ ko còn khả dụng.
        allowNull: false,
        defaultValue: DB_CONST.LISTING.STATUS.AVAILABLE,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imgs_url: {
        type: DataTypes.JSON,
        allowNull: false,
        get: function () {
          return JSON.parse(this.getDataValue("imgs_url"));
        },
        set: function (val) {
          this.setDataValue("imgs_url", JSON.stringify(val));
        },
      },
      user_owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: DB_CONST.DB_NAME.LISTING,
    }
  );
  return Listing;
};
