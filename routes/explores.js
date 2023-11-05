const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(async (res, req) => {

    }))
    .post(catchAsync(async (res, req) => {

    }))

router.route('/new')
    .get(catchAsync(async (res, req) => {

    }))