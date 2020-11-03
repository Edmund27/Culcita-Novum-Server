"use strict";
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Ivo",
          surname: "Yankov",
          email: "i@i.com",
          password: bcrypt.hashSync("i", SALT_ROUNDS),
          image: "test",
          lat: 52.390445,
          lng: 4.665452,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Odette",
          surname: "Pule",
          email: "o@o.com",
          password: bcrypt.hashSync("o", SALT_ROUNDS),
          image: "test",
          lat: 52.510445,
          lng: 4.695452,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Edmund",
          surname: "Pafko",
          email: "e@e.com",
          password: bcrypt.hashSync("e", SALT_ROUNDS),
          image: "test",
          lat: 56.390445,
          lng: 4.965452,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
