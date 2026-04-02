const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/activities", activityRoutes);

app.get("/", (req, res) => {
  res.send("EcoTrack API funcionando");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});