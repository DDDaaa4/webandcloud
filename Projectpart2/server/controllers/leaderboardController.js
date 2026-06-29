const User = require('../models/User');
const Prediction = require('../models/Prediction');

async function getLeaderboard(req, res, next) {
    try {
        const predictionScores = await Prediction.aggregate([
            {
                $group: {
                    _id: '$user',
                    points: { $sum: '$confidencePoints' },
                    predictionsCount: { $sum: 1 }
                }
            },
            { $sort: { points: -1, predictionsCount: -1 } },
            { $limit: 20 }
        ]);

        const userIds = predictionScores.map(item => item._id);
        const users = await User.find({ _id: { $in: userIds } })
            .select('username')
            .lean();

        const userMap = new Map(users.map(user => [String(user._id), user.username]));
        const result = predictionScores.map(item => ({
            id: item._id,
            username: userMap.get(String(item._id)) || 'Unknown user',
            points: item.points,
            predictionsCount: item.predictionsCount
        }));

        return res.json({ users: result });
    } catch (error) {
        next(error);
    }
}

module.exports = { getLeaderboard };
