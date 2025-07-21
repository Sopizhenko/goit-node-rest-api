import { Sequelize } from "sequelize";
import { config } from "./env.js";

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: "postgres",
    logging: false, // Вимкнути логи SQL запитів
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
