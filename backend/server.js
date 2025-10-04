// server.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
    res.send("Nerk you nas!! 🥲");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Test Test
app.get("/api/tasks", (req, res) => {
    res.json([
        { id: 1, title: "Nerk you nas!! 🥲" },
        { id: 2, title: "Sl you nas!! 🫀" }
    ]);
});