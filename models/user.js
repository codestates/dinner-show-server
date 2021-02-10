"use strict";

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      user_password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      birth: DataTypes.STRING,
      sex: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      salt: DataTypes.STRING,
    },
    {}
  );
  user.associate = function (models) {
    // associations can be defined here
    user.hasMany(models.content, {
      foreignKey: "userId",
      as: "contents",
    });
  };
  return user;
};
