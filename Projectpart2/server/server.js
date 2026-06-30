require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const externalRoutes = require('./routes/externalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'World Cup Prediction API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/external', externalRoutes);

app.use('/api', (req, res) => {
    res.status(404).json({
        message: 'API route not found'
    });
});

const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
