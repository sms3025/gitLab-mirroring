const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const ranking = require('../controllers/ranking')


router.route('/')
    .get(catchAsync(ranking.showRanking));

module.exports = router;