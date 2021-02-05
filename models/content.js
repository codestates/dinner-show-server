"use strict";
module.exports = (sequelize, DataTypes) => {
  const content = sequelize.define(
    "content",
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      heart_number: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      location: DataTypes.STRING,
      img: DataTypes.STRING,
      tag: DataTypes.STRING,
    },
    {}
  );
  content.associate = function (models) {
    // associations can be defined here
    content.belongsTo(models.user, {
      foreignKey: "userId",
    });
    content.hasMany(models.comment, {
      foreignKey: "contentId",
      as: "comments",
    });
  };
  return content;
};
