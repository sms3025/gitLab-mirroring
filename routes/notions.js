const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const notions = require('../controllers/notions');
const { upload } = require('../aws/index');
const { isLoggedIn } = require('../middleware');

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
router.route('/:crewId/notion')
    .get()
    .post(isLoggedIn, upload.single('filename'), catchAsync(notions.createNotion))

/**
 * @swagger
 * /crew/:crewId/notion/:notionId:
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
 *  delete:
 *      tags: [notion]
 *      summary: 해당 게시글 삭제하기
 * 
 *  get:
 *      tags: [notion]
 *      summary: 해당 게시글 보여주기
 * 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                           $ref: '#/components/schemas/Notion'
 */
router.route('/:crewId/notion/:notionId')
    .get(isLoggedIn, catchAsync(notions.showNotion))
    .delete(isLoggedIn, catchAsync(notions.deleteNotion))

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
router.route('/:crewId/notion/:notionId/comments')
    .post(isLoggedIn, catchAsync(notions.createNotionComment))

/**
 * @swagger
 * /crew/:crewId/notion/:notionId/comments/:commentId:
 *  delete:
 *      tags: [notion]
 *      summary: 해당 게시글에 해당 댓글 삭제하기
 */
router.route('/:crewId/notion/:notionId/comments/:commentId')
    .delete(isLoggedIn, catchAsync(notions.deleteNotionComment))

module.exports = router;
