const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get()
    .post(catchAsync(async (res, req) => {

    }))

router.route('/login')
    .get()
    .post(catchAsync(async (res, req) => {

    }))

module.exports = router;