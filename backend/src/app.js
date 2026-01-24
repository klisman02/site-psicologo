const express = require("express");
const cors = require("cors");
const contatoRoutes = require("./routes/ContactRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", contatoRoutes);

module.exports = app;
