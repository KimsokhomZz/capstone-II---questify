const express = require('express');
const userRoutes = require('./routes/userRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/pomodoro', pomodoroRoutes);

module.exports = app;
