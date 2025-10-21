// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controller/authController");
const {
  protect,
  authorize,
  adminOnly,
} = require("../middleware/authMiddleware");

/**
 * @route   POST /auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /auth/me
 * @desc    Get current logged-in user info
 * @access  Private (requires authentication)
 */
router.get("/me", protect, getMe);
module.exports = router;
