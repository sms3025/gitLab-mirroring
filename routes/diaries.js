const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Diary = require('../models/diary')
const User = require('../models/user')

router.route('/')
    .post(catchAsync(async (req, res) => {
        //create new diary
        const diary = new Diary(req.body);
        await diary.save();

        res.status(201);
    }))

router.route('/new')
    .get(catchAsync(async (req, res,) => {
        // render new diary form
        const userId = req.body._id
        const user = await User.findById(userId).populate('crews')
        if (!user) {

        }
        const crews = { crews: user.crews }

        res.status(200).send(crews)
    }))




module.exports = router;