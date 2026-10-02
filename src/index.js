const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

let models;

const databaseCredentials = JSON.parse(process.env.GYM_DB);

const DB_WRITER_HOST = process.env.GYM_DB_HOST || databaseCredentials.host;
const DB_READER_HOST =
  process.env.GYM_DB_READER_HOST || databaseCredentials.readerHost;

const DB_PORT = process.env.GYM_DB_PORT || databaseCredentials.port;

const DB_USERNAME = process.env.GYM_DB_USER || databaseCredentials.username;
const DB_PASSWORD = process.env.GYM_DB_PASSWORD || databaseCredentials.password;

const sequelize = new Sequelize(
  process.env.GYM_DB_INSTANCE || databaseCredentials.dbname,
  process.env.GYM_DB_USER || databaseCredentials.username,
  process.env.GYM_DB_PASSWORD || databaseCredentials.password,
  {
    dialect: "postgres",
    replication: {
      read: [
        {
          host: DB_READER_HOST,
          port: DB_PORT,
          username: DB_USERNAME,
          password: DB_PASSWORD,
        },
      ],
      write: {
        host: DB_WRITER_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
      },
    },
    pool: {
      max: Number(process.env.GYM_DB_MAX_CONNECTIONS) || 20,
      idle: Number(process.env.GYM_DB_IDLE_CONNECTIONS) || 30000,
    },
    define: {
      // prevent sequelize from pluralizing table names
      freezeTableName: true,
    },
    schema: "gymhub",
    logging: process.env.GYM_DB_LOGGING === "true",
  },
);

const modelsPath = path.join(__dirname, "models");
models = fs.readdirSync(modelsPath).reduce((models, file) => {
  const filePath = path.join(modelsPath, file);
  const isDir = fs.lstatSync(filePath).isDirectory();

  if (file.indexOf(".") !== 0 && !isDir && file !== "index.js") {
    // const model = sequelize['import'](filePath);
    const model = require(filePath)(sequelize, Sequelize.DataTypes);
    return { ...models, [model.name]: model };
  }

  return models;
}, {});

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

const sequelizeLoader = async ({ app }) => {};

module.exports = {
  sequelize,
  models,
  sequelizeLoader,
};
