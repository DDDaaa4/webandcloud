require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('../models/Match');
const matches = require('../data/matches.seed.json');

async function seedMatches() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);

        for (const match of matches) {
            await Match.findOneAndUpdate(
                { matchNum: match.matchNum },
                match,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log(`Seeded ${matches.length} matches`);
        await mongoose.disconnect();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

seedMatches();
