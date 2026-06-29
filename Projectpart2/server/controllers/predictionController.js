const Match = require('../models/Match');
const Prediction = require('../models/Prediction');

function validatePredictionInput({ selectedResult, confidencePoints }) {
    if (!['home', 'draw', 'away'].includes(selectedResult)) {
        return 'selectedResult must be home, draw, or away.';
    }

    if (!Number.isInteger(confidencePoints) || confidencePoints < 1 || confidencePoints > 10) {
        return 'confidencePoints must be an integer between 1 and 10.';
    }

    return null;
}

function isMatchLocked(match) {
    return match.status === 'finished' || new Date(match.matchDate).getTime() <= Date.now();
}

async function createPrediction(req, res, next) {
    try {
        const { matchId, selectedResult, confidencePoints } = req.body;

        if (!matchId) {
            return res.status(400).json({ message: 'matchId is required.' });
        }

        const errorMessage = validatePredictionInput({ selectedResult, confidencePoints });
        if (errorMessage) {
            return res.status(400).json({ message: errorMessage });
        }

        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found.' });
        }

        if (isMatchLocked(match)) {
            return res.status(400).json({ message: 'Prediction is locked for this match.' });
        }

        const prediction = await Prediction.create({
            user: req.user._id,
            match: matchId,
            selectedResult,
            confidencePoints
        });

        return res.status(201).json({ message: 'Prediction created.', prediction });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You already predicted this match. Update your existing prediction instead.' });
        }
        next(error);
    }
}

async function getMyPredictions(req, res, next) {
    try {
        const predictions = await Prediction.find({ user: req.user._id })
            .populate('match')
            .sort('-createdAt');
        return res.json({ count: predictions.length, predictions });
    } catch (error) {
        next(error);
    }
}

async function updatePrediction(req, res, next) {
    try {
        const { selectedResult, confidencePoints } = req.body;
        const errorMessage = validatePredictionInput({ selectedResult, confidencePoints });
        if (errorMessage) {
            return res.status(400).json({ message: errorMessage });
        }

        const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id }).populate('match');
        if (!prediction) {
            return res.status(404).json({ message: 'Prediction not found.' });
        }

        if (isMatchLocked(prediction.match)) {
            return res.status(400).json({ message: 'Prediction is locked for this match.' });
        }

        prediction.selectedResult = selectedResult;
        prediction.confidencePoints = confidencePoints;
        await prediction.save();

        return res.json({ message: 'Prediction updated.', prediction });
    } catch (error) {
        next(error);
    }
}

async function deletePrediction(req, res, next) {
    try {
        const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id }).populate('match');
        if (!prediction) {
            return res.status(404).json({ message: 'Prediction not found.' });
        }

        if (isMatchLocked(prediction.match)) {
            return res.status(400).json({ message: 'Prediction is locked for this match.' });
        }

        await prediction.deleteOne();
        return res.json({ message: 'Prediction deleted.' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPrediction,
    getMyPredictions,
    updatePrediction,
    deletePrediction
};
