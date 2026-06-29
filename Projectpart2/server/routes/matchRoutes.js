const express = require('express');
const {
    getMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch
} = require('../controllers/matchController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getMatches);
router.get('/:id', getMatchById);
router.post('/', protect, adminOnly, createMatch);
router.put('/:id', protect, adminOnly, updateMatch);
router.delete('/:id', protect, adminOnly, deleteMatch);

module.exports = router;
