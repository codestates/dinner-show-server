"use strict";

module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    "comment",
    {
      name: DataTypes.STRING,
      text: DataTypes.STRING,
    },
    {}
  );
  comment.associate = function (models) {
    // associations can be defined here
    comment.belongsTo(models.content, {
      foreignKey: "contentId",
    });
  };
  return comment;
};
