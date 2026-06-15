const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/application.routes");
const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Middleware FIRST
app.use(express.json());
app.use(cors());

// Routes AFTER
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;