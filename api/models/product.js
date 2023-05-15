const { sequelize, DataTypes } = require("../../sequelize");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    owner_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    sequelize,
    tableName: "Product",
  }
);

module.exports = Product;
