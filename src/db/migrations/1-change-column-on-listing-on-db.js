'use strict';

const { DB_CONST } = require('../../constants/index.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const model = await queryInterface.describeTable(DB_CONST.TABLE_NAME.LISTING);

    if (model.imgs_url) {
      await queryInterface.changeColumn(DB_CONST.TABLE_NAME.LISTING, 'imgs_url', {
        type: Sequelize.JSON,
        allowNull: false,
        get: function() {
          console.log('áldfjlasf', this.getDataValue('imgs_url'));
          return JSON.parse(this.getDataValue('imgs_url'));
        },
        set: function(val) {
          this.setDataValue('imgs_url', JSON.stringify(val)); 
        }
      })
    }

  },
  async down(queryInterface, Sequelize) {}
};