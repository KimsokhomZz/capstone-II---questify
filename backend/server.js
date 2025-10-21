// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, testConnection } = require("./src/database/config");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Questify API! 🎯",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// Test route (you can remove this later)
app.get("/api/tasks", (req, res) => {
  res.json([
    { id: 1, title: "Nerk you nas!! 🥲" },
    { id: 2, title: "Sl you nas!! 🫀" },
    { id: 3, title: "Okay" },
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (creates tables if they don't exist, updates schema if changed)
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
