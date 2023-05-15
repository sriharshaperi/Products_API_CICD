require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DIALECT } = process.env;
const DB_HOST = process.env.DB_HOST;
console.log("DB_NAME ==> " + DB_NAME);
console.log("DB_USERNAME ==> " + DB_USERNAME);
console.log("DB_PASSWORD ==> " + DB_PASSWORD);
console.log("DB_HOST ==> " + DB_HOST);

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DIALECT,
  dialectOptions: {
    ssl: "Amazon RDS",
  },
});

if (process.env.NODE_ENV === "dev") {
  console.log("first");
  sequelize
    .sync()
    .then(() => console.log("Connected to MYSQL DB"))
    .catch((error) => {
      console.log(error);
      console.log("DB Connection Failed");
    });
}

module.exports = { sequelize, DataTypes };
