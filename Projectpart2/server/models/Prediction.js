const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    selectedResult: {
        type: String,
        enum: ['home', 'draw', 'away'],
        required: true
    },
    confidencePoints: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
}, { timestamps: true });

predictionSchema.index({ user: 1, match: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema);
