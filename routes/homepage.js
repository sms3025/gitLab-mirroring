const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { showHomepage, getDiaryByDate, initHomepage } = require('../controllers/homepage');

/**
 * @swagger
 * /homepage:
 *  get:
 *      tags: [homepage]
 *      summary: 홈 화면 보여주기
 */

router.route('/')
    .get(catchAsync(showHomepage))

router.route('/:day')
    .get(catchAsync(getDiaryByDate))

module.exports = router;