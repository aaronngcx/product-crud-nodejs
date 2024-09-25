// @ts-nocheck
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'product',
      {
        id: {
          type: Sequelize.INTEGER(10),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: "id"
        },
        code: {
          type: Sequelize.STRING(9),
          allowNull: false,
          unique: true,
          field: "code"
        },
        name: {
          type: Sequelize.STRING(90),
          allowNull: false,
          field: "name"
        },
        category: {
          type: Sequelize.STRING(28),
          allowNull: false,
          field: "category"
        },
        brand: {
          type: Sequelize.STRING(28),
          allowNull: true,
          field: "brand"
        },
        type: {
          type: Sequelize.STRING(21),
          allowNull: true,
          field: "type"
        },
        description: {
          type: Sequelize.STRING(180),
          allowNull: true,
          field: "description"
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at"
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at"
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('product');
  }
};
