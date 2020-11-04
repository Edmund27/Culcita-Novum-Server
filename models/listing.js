"use strict";
module.exports = (sequelize, DataTypes) => {
  const listing = sequelize.define(
    "listing",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  );
  listing.associate = function (models) {
    listing.belongsTo(models.user);
    listing.belongsTo(models.category);
  };
  return listing;
};