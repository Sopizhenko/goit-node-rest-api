import dotenv from "dotenv";

// Завантажуємо змінні середовища з .env файлу
dotenv.config();

export const config = {
  database: {
    name: process.env.DB_NAME || "contacts_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
  },
};
