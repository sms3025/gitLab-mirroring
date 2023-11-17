const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const notions = require('../controllers/notions');
const { upload } = require('../aws/index');

/**
 * @swagger
 * /crew/:crewId/notion:
 *  post:
 *      tags: [notion]
 *      summary: 게시글 추가하기
 *
 */
router.route('/')
    .get()
    .post(upload.single('filename'), catchAsync(notions.createNotion))

/**
 * @swagger
 * /crew/:crewId/notion/:notionId:
 *  delete:
 *      tags: [notion]
 *      summary: 해당 게시글 삭제하기
 */
router.route('/:notionId')
    .delete(catchAsync(notions.deleteNotion))

/**
 * @swagger
 * /crew/:crewId/notion/:notionId/comments:
 *  post:
 *      tags: [notion]
 *      summary: 해당 게시글에 댓글 추가하기
 */
router.route('/:notionId/comments')
    .post(catchAsync(notions.createNotionComment))

/**
 * @swagger
 * /crew/:crewId/notion/:notionId/comments/:commentId:
 *  delete:
 *      tags: [notion]
 *      summary: 헤당 게시글에 해당 댓글 삭제하기
 */
router.route('/:notionId/comments/:commentId')
    .delete(catchAsync(notions.deleteNotionComment))

module.exports = router;