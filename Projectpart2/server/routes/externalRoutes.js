const express = require('express');
const { getCountryInfo } = require('../controllers/externalController');

const router = express.Router();

router.get('/country/:name', getCountryInfo);

module.exports = router;
