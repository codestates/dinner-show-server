"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("contents", "userId", Sequelize.INTEGER);

    // foreign key 연결
    await queryInterface.addConstraint("contents", {
      fields: ["userId"],
      type: "foreign key",
      name: "FK_any_name_you_want",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("contents", "FK_any_name_you_want");
    await queryInterface.removeColumn("contents", "userId");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
