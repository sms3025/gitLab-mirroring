const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const explores = require('../controllers/explores')


/**
 * @swagger
 * /explores:
 *  get:
 *      tags: [explores]
 *      summary: 크루 목록 보여주기
 */
router.route('/')
    .get(catchAsync(explores.showExplores));

module.exports = router;