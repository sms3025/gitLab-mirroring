const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Crew = require('../models/crew');

router.route('/')
    .get(catchAsync(async (req, res) => {
        // 모든 크루 정보 보이기
        const crews = await Crew.find({});

        const result = {crews: crews};
        res.status(200).send(result);
    }));

module.exports = router;