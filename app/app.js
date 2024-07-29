const express = require("express");
const dataRouter = require("./controllers/dataRouter");
const app = express();

app.use(express.json());

app.use("/api/data", dataRouter);

module.exports = app;
