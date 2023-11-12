const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const explores = require('../controllers/explores')


router.route('/')
    .get(catchAsync(explores.showExplores));

module.exports = router;