const express = require("express");
const mailerController = require("./controller/mailerController");
const app = express();
app.use(express.json());
app.use("/sendmail", mailerController);
module.exports = app;