require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.DATABASE_PASSWORD,
    database: "dinnerShow",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "dinnershow",
    password: process.env.DATABASE_PASSWORD,
    database: "dinnerShow",
    host: "two-weeks-project.cuiuxyl7o7dg.ap-northeast-2.rds.amazonaws.com",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DATABASE_PASSWORD,
    database: "dinnerShow",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};