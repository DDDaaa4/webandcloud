const Match = require('../models/Match');

function validateMatchInput(body) {
    const required = ['matchNum', 'homeTeam', 'awayTeam', 'homeFlag', 'awayFlag', 'matchDate'];
    const missing = required.filter(field => body[field] === undefined || body[field] === '');

    if (missing.length) {
        return `Missing required fields: ${missing.join(', ')}`;
    }

    if (body.status && !['upcoming', 'finished'].includes(body.status)) {
        return 'Status must be upcoming or finished.';
    }

    return null;
}

async function getMatches(req, res, next) {
    try {
        const { team, status, sort = 'matchDate' } = req.query;
        const query = {};

        if (team) {
            query.$or = [
                { homeTeam: { $regex: team, $options: 'i' } },
                { awayTeam: { $regex: team, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        const matches = await Match.find(query).sort(sort);
        return res.json({ count: matches.length, matches });
    } catch (error) {
        next(error);
    }
}

async function getMatchById(req, res, next) {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found.' });
        }
        return res.json({ match });
    } catch (error) {
        next(error);
    }
}

async function createMatch(req, res, next) {
    try {
        const errorMessage = validateMatchInput(req.body);
        if (errorMessage) {
            return res.status(400).json({ message: errorMessage });
        }

        const match = await Match.create(req.body);
        return res.status(201).json({ message: 'Match created.', match });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Match number already exists.' });
        }
        next(error);
    }
}

async function updateMatch(req, res, next) {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!match) {
            return res.status(404).json({ message: 'Match not found.' });
        }

        return res.json({ message: 'Match updated.', match });
    } catch (error) {
        next(error);
    }
}

async function deleteMatch(req, res, next) {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found.' });
        }
        return res.json({ message: 'Match deleted.' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch
};
