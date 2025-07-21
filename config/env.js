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
  email: {
    host: process.env.EMAIL_HOST || "smtp.meta.ua",
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_AUTH_USER || "goitnodejs@meta.ua",
      pass: process.env.EMAIL_AUTH_PASS || "password",
    },
  },
};
