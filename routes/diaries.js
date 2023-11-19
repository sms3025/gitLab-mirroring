const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const diaries = require('../controllers/diaries')
const { upload } = require('../aws/index');

/**
 * @swagger
 * /diary:
 *  post:
 *      tags: [diary]
 *      summary: 운동기록 추가하기
 */
router.route('/')
    .post(upload.single('filename'), catchAsync(diaries.createDiary))

/**
 * @swagger
 * /diary/new:
 *  get:
 *      tags: [diary]
 *      summary: 새로운 운동기록 추가 폼
 */
router.route('/new')
    .get(catchAsync(diaries.newDiaryForm))

/**
 * @swagger
 * /diary/:diaryId:
 *  delete:
 *      tags: [diary]
 *      summary: 해당 운동기록 삭제하기
 */
router.route('/:diaryId')
    .delete(catchAsync(diaries.deleteDiary))

/**
 * @swagger
 * /diary/:diaryId/comments:
 *  post: 
 *      tags: [diary]
 *      summary: 해당 운동기록에 댓글 추가하기
 * 
 */
router.route('/:diaryId/comments')
    .post(catchAsync(diaries.createDiaryComment))

/**
 * @swagger
 * /diary/:diaryId/comments/:commentsId:
 *  delete:
 *      tags: [diary]
 *      summary: 해당 운동기록에 해당 댓글 삭제하기
 */
router.route('/:diaryId/comments/:commentId')
    .delete(catchAsync(diaries.deleteDiaryComment))


module.exports = router;