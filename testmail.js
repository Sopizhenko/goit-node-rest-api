import nodemailer from "nodemailer";
import { config } from "./config/env.js";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: true,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass,
  },
});

const emailOptions = {
  from: config.email.auth.user,
  to: "a.sopizhenko@ukr.net",
  subject: "Nodemailer test",
  text: "Привіт. Ми тестуємо надсилання листів!",
};

transporter
  .sendMail(emailOptions)
  .then((info) => console.log(info))
  .catch((err) => console.log(err));
