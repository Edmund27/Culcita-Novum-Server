"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: DataTypes.STRING,
      lat: { type: DataTypes.FLOAT, allowNull: false },
      lng: { type: DataTypes.FLOAT, allowNull: false },
    }
  );
  user.associate = function (models) {
    user.hasMany(models.chat, {
      foreignKey: "user1Id"
    });
    user.hasMany(models.chat, {
      foreignKey: "user2Id"
    });
    user.hasMany(models.listing, {
      foreignKey: "userId"
    });
  };
  return user;
};