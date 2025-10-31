const PomodoroSession = require("../models/pomodoroSessionModel");

exports.completeSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await PomodoroSession.findOne({ where: { id: sessionId } });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Pomodoro session not found",
      });
    }

    session.xp_earned += 5; // Award 5 XP for completing the session
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Pomodoro session completed successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error completing Pomodoro session:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.pauseSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await PomodoroSession.findOne({ where: { id: sessionId } });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    if (session.completed)
      return res
        .status(400)
        .json({ success: false, message: "Cannot pause a completed session" });

    session.status = "paused";
    await session.save();

    return res
      .status(200)
      .json({ success: true, message: "Session paused", data: session });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.resetSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await PomodoroSession.findOne({ where: { id: sessionId } });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    session.status = "active";
    session.start_time = 0;
    session.end_time = 0;
    session.duration = 0;
    session.completed = false;

    await session.save();

    return res
      .status(200)
      .json({ success: true, message: "Session reset", data: session });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
