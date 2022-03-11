const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports =  nodemailer.createTransport({
    host: "gmail",
    port: 465,
    secure: false, 
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
});