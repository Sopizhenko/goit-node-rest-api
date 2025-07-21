import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, currentUser);
router.patch("/avatars", authMiddleware, updateAvatar);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmail);

export default router;
