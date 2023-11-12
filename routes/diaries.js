const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const diaries = require('../controllers/diaries')
const { upload } = require('../aws/index');

router.route('/')
    .post(upload.single('filename'), catchAsync(diaries.createDiary))

router.route('/new')
    .get(catchAsync(diaries.newDiaryForm))

router.route('/:diaryId')
    .delete(catchAsync(diaries.deleteDiary))

router.route('/:diaryId/comments')
    .post(catchAsync(diaries.createDiaryComment))

router.route('/:diaryId/comments/:commentId')
    .delete(catchAsync(diaries.deleteDiaryComment))


module.exports = router;