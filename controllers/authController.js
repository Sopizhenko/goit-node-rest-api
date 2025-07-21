import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const tempDir = path.join(process.cwd(), "temp");
const avatarsDir = path.join(process.cwd(), "public", "avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Унікальне ім'я: userId + timestamp + розширення
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarurl = gravatar.url(email, { s: "250", d: "retro" }, true);
    const user = await User.create({
      email,
      password: hashedPassword,
      subscription: "starter",
      avatarurl,
    });
    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarurl: user.avatarurl,
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    user.token = token;
    await user.save();
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export const currentUser = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const updateAvatar = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const { path: tempPath, filename } = req.file;
      const newPath = path.join(avatarsDir, filename);
      await fs.rename(tempPath, newPath);
      const avatarurl = `/avatars/${filename}`;
      req.user.avatarurl = avatarurl;
      await req.user.save();
      res.status(200).json({ avatarurl });
    } catch (err) {
      next(err);
    }
  },
];
