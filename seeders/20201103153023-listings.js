'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "listings",
      [
        {
          title: "Iphone 6",
          description: "Test",
          image: "test",
          availability: "available",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          categoryId: 1
        },
        {
          title: "Black Sofa",
          description: "Test",
          image: "test",
          availability: "unavailable",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 2,
          categoryId: 2
        },
        {
          title: "Garden Set",
          description: "A bit rusty but can look great with some love",
          image: "test",
          availability: "available",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 3,
          categoryId: 3
        },

        {
          title: "Zara Jeans",
          description: "No longer fits due to corona kilos, I hope I can make someone happy with it",
          image: "test",
          availability: "unavailable",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          categoryId: 5
        },
        {
          title: "Men's tie",
          description: "Test",
          image: "test",
          availability: "available",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          categoryId: 6
        },
        {
          title: "Peace Lily",
          description: "She doesnt like our home and is being a little dramatic, would suit someone with a lot of light in their house",
          image: "test",
          availability: "available",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 2,
          categoryId: 7
        },
        {
          title: "Lego Castle",
          description: "Im tired of stepping on this",
          image: "test",
          availability: "unavailable",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          categoryId: 8
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("listings", null, {});
  },
};
