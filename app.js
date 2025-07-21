import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { initDatabase } from "./config/initDatabase.js";

const app = express();

// Додаю визначення __dirname для ES-модуля
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Додаю middleware для роздачі статики з папки public
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// Ініціалізуємо базу даних та запускаємо сервер
const startServer = async () => {
  try {
    await initDatabase();

    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
