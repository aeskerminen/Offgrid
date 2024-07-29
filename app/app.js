const express = require("express");
const cors = require("cors");

const dataRouter = require("./controllers/dataRouter");
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3003" }));

app.use("/api/data", dataRouter);

module.exports = app;
