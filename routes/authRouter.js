import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { currentUser } from "../controllers/currentUserController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, currentUser);

export default router;
