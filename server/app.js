const express = require("express");
const controller = require("./controller/index");
const app = express();
app.use(express.json());

app.use(express.static("public"));
app.use("/", controller);

module.exports = app;
