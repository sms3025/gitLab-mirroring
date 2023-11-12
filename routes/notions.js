const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const notions = require('../controllers/notions');
const { upload } = require('../aws/index');

router.route('/')
    .get()
    .post(upload.single('filename'), catchAsync(notions.createNotion))

router.route('/:notionId')
    .delete(catchAsync(notions.deleteNotion))

router.route('/:notionId/comments')
    .post(catchAsync(notions.createNotionComment))

router.route('/:notionId/comments/:commentId')
    .delete(catchAsync(notions.deleteNotionComment))

module.exports = router;