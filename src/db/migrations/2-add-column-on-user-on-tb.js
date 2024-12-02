"use strict";

const { DB_CONST } = require("../../constants/index.js");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const model = await queryInterface.describeTable(DB_CONST.TABLE_NAME.USER);

    if (!model.deleted) {
      await queryInterface.addColumn(DB_CONST.TABLE_NAME.USER, "deleted", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
  },
  async down(queryInterface, Sequelize) {
    const model = await queryInterface.describeTable(DB_CONST.TABLE_NAME.USER);

    if (model.deleted) {
      await queryInterface.removeColumn(DB_CONST.TABLE_NAME.USER, "deleted");
    }
  },
};
