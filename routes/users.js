const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get()
    .post(catchAsync(async (req, res) => {

    }))

router.route('/login')
    .get((req, res) => {
        res.send("this is login page!");
    })
    .post(catchAsync(async (req, res) => {

    }))

module.exports = router;