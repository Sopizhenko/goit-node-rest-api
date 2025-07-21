import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { config } from "../config/env.js";
dotenv.config();

const transporter = nodemailer.createTransport(config.email);

export const sendTestEmail = async () => {
  const emailOptions = {
    from: config.email.auth.user,
    to: "noresponse@gmail.com",
    subject: "Nodemailer test",
    text: "Привіт. Ми тестуємо надсилання листів!",
  };
  try {
    const info = await transporter.sendMail(emailOptions);
    console.log(info);
    return info;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const sendVerificationEmail = async (to, verificationToken) => {
  const emailOptions = {
    from: config.email.auth.user,
    to,
    subject: "Email verification",
    html: `<p>Для підтвердження email перейдіть за <a href="http://localhost:3000/api/auth/verify/${verificationToken}">посиланням</a></p>`,
  };
  try {
    const info = await transporter.sendMail(emailOptions);
    return info;
  } catch (err) {
    throw err;
  }
};
