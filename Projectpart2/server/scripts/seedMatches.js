require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('../models/Match');
const matches = require('../data/matches.seed.json');

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

async function seedMatches() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);

        for (const match of matches) {
            const futureMatchDate = new Date(Date.now() + match.matchNum * ONE_DAY_IN_MS);

            await Match.findOneAndUpdate(
                { matchNum: match.matchNum },
                {
                    ...match,
                    matchDate: futureMatchDate,
                    status: 'upcoming',
                    homeScore: null,
                    awayScore: null
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log(`Seeded ${matches.length} matches with future dates`);
        await mongoose.disconnect();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

seedMatches();