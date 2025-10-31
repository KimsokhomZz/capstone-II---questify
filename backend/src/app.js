const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");

const app = express();
app.use(express.json());

// Use a specific origin for development to avoid wildcard issues
const corsOptions = {
  origin: "*", // allow all origins (development only)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Enable CORS and preflight responses
app.use(cors(corsOptions));

app.use("/api/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/users", userRoutes);
app.use("/api/pomodoro", pomodoroRoutes);

module.exports = app;
