"use strict";
const { Model, STRING } = require("sequelize");
const { DB_CONST } = require("../../../constants");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models[DB_CONST.DB_NAME.USER], {
        foreignKey: "user_book_id",
        onDelete: "CASCADE",
        as: "user_booking",
      });
      Booking.hasOne(models[DB_CONST.DB_NAME.LISTING], {
        foreignKey: "listing_id",
        onDelete: "CASCADE",
      });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        unique: true,
        primaryKey: true,
      },
      listing_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_book_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // user_owner_id: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
      check_in_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      total_price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      guest_count: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          DB_CONST.BOOKING.STATUS.PENDING,
          DB_CONST.BOOKING.STATUS.CONFIRMED,
          DB_CONST.BOOKING.STATUS.CANCELLED,
          DB_CONST.BOOKING.STATUS.COMPLETED
        ),
        defaultValue: DB_CONST.BOOKING.STATUS.PENDING,
      },
    },
    {
      sequelize,
      modelName: DB_CONST.DB_NAME.BOOKING,
    }
  );
  return Booking;
};
