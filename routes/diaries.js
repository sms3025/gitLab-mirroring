const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Diary = require('../models/diary')
const User = require('../models/user')
const { upload } = require('../aws/index');

router.route('/')
    .post(upload.array('filename'), catchAsync(async (req, res) => {
        //create new diary

        const diary = new Diary(req.body);
        diary.crewimage = req.files.map(f => ({ url: f.path, filename: f.filename }));
        await diary.save();

        res.status(201);
    }))

router.route('/new')
    .get(catchAsync(async (req, res) => {
        // render new diary form
        const userId = req.user._id
        const user = await User.findById({ _id: userId }).populate('crews')
        if (!user) {

        }
        const crews = { crews: user.crews }

        res.status(200).send(crews)
    }))




module.exports = router;