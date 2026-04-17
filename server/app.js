const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./routes/application.routes")
const authRoutes = require("./routes/auth.routes");
const app = express();
const aiRoutes = require("./routes/ai.routes");
app.use("/api/ai", aiRoutes);

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;