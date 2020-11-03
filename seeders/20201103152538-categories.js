'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "Electronics",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Indoor Furniture",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Outdoor Furniture",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Household",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Woman's Clothes, Shoes & Accessories",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Men's Clothes, Shoes & Accessories",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Plants",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        {
          name: "Children's Toys",
          createdAt: new Date(),
          updatedAt: new Date(),
         
        },
        
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
