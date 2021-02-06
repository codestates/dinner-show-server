"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("contents", "location", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("contents", "img", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("contents", "img"),
      queryInterface.removeColumn("contents", "location"),
    ]);
  },
};
