const express = require("express");
const router = express.Router();
const pomodoroController = require("../controllers/pomodoroController");

router.post("/complete", pomodoroController.completeSession);
router.post("/pause", pomodoroController.pauseSession);
router.post("/reset", pomodoroController.resetSession);

module.exports = router;
