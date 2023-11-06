const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(async (req, res) => {

    }))
    .post(catchAsync(async (req, res) => {

    }))

router.route('/new')
    .get(catchAsync(async (req, res) => {

    }))

module.exports = router;