const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchNum: {
        type: Number,
        required: true,
        unique: true
    },
    homeTeam: {
        type: String,
        required: true,
        trim: true
    },
    awayTeam: {
        type: String,
        required: true,
        trim: true
    },
    homeFlag: {
        type: String,
        required: true
    },
    awayFlag: {
        type: String,
        required: true
    },
    matchDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'finished'],
        default: 'upcoming'
    },
    homeScore: {
        type: Number,
        default: null
    },
    awayScore: {
        type: Number,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
