"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn("contents", "userId", {
      type: "integer",
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn("contents", "userId");
  },
};
