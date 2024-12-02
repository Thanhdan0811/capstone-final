"use strict";
const { Model, STRING } = require("sequelize");
const { DB_CONST } = require("../../../constants/index.js");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models[DB_CONST.DB_NAME.USER], { foreignKey: 'user_id', onDelete: 'CASCADE' })
      Comment.belongsTo(models[DB_CONST.DB_NAME.LISTING], { foreignKey: 'listing_id', onDelete: 'CASCADE' })
    }
  }
  Comment.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: DB_CONST.DB_NAME.COMMENT,
    }
  );
  return Comment;
};
