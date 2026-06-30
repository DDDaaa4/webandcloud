const express = require('express');
const {
    createPrediction,
    getMyPredictions,
    updatePrediction,
    deletePrediction
} = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createPrediction);
router.get('/mine', protect, getMyPredictions);
router.put('/:id', protect, updatePrediction);
router.delete('/:id', protect, deletePrediction);

module.exports = router;
