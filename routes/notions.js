const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const notions = require('../controllers/notions');
const { upload } = require('../aws/index');

/**
 * @swagger
 * /crew/{crewId}/notion:
 *  parameters:
 *  - name: crewId
 *    in: path
 *    required: true
 *    description: 크루 id
 *    schema:
 *      type: string 
 *  post:
 *      tags: [notion]
 *      summary: 게시글 추가하기
 *      
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          text:
 *                              type: string
 *                              description: 게시글 내용
 *                          image:
 *                              type: string
 *                              description: 게시글 이미지
 *      responses:
 *          '200':
 *              description: OK
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
 * /crew/{crewId}/notion/{notionId}/comments:
 *  parameters:
 *  - name: crewId
 *    in: path
 *    required: true
 *    description: 크루 id
 *    schema:
 *      type: number 
 *  - name: notionId
 *    in: path
 *    required: true
 *    schema:
 *      type: number
 * 
 *  post:
 *      tags: [notion]
 *      summary: 해당 게시글에 댓글 추가하기
 * 
 *      requestBody:
 *          content: 
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          text:
 *                              type: string
 *                              description: 댓글 내용
 *      responses:
 *          '200':
 *              description: OK
 */
router.route('/:notionId/comments')
    .post(catchAsync(notions.createNotionComment))

/**
 * @swagger
 * /crew/:crewId/notion/:notionId/comments/:commentId:
 *  delete:
 *      tags: [notion]
 *      summary: 해당 게시글에 해당 댓글 삭제하기
 */
router.route('/:notionId/comments/:commentId')
    .delete(catchAsync(notions.deleteNotionComment))

module.exports = router;