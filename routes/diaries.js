const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const diaries = require('../controllers/diaries')
const { upload } = require('../aws/index');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /diary:
 *  post:
 *      tags: [diary]
 *      summary: 운동기록 추가하기
 * 
 *      requestBody:
 *          content: 
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          crewId:
 *                              type: number
 *                              description: 운동기록 올릴 크루 id
 *                          type:
 *                              type: string
 *                              description: 운동 종류
 *                          time: 
 *                              type: number
 *                              description: 운동 한 시간
 *                          memo:
 *                              type: string
 *                              description: 운동 기록 메모
 *                          image:
 *                              type: binary
 *                              description: 운동 기록 이미지
 *      responses:
 *          '200':
 *              description: OK
 * 
 */
router.route('/')
    .post(isLoggedIn, upload.single('filename'), catchAsync(diaries.createDiary))

/**
 * @swagger
 * /diary/new:
 *  get:
 *      tags: [diary]
 *      summary: 새로운 운동기록 추가 폼
 * 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Crew'
 *                              
 */
router.route('/new')
    .get(isLoggedIn, catchAsync(diaries.newDiaryForm))

/**
 * @swagger
 * /diary/{diaryId}:
 *  parameters:
 *  - name: diaryId
 *    in: path
 *    required: true
 *    description: 운동기록 id
 *      
 *  delete:
 *      tags: [diary]
 *      summary: 해당 운동기록 삭제하기
 *  
 *  get:
 *      tags: [diary]
 *      summary: 해당 운동기록 보여주기
 *      
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Diary'
 *          
 */
router.route('/:diaryId')
    .get(isLoggedIn, catchAsync(diaries.showDiary))
    .delete(isLoggedIn, catchAsync(diaries.deleteDiary))

/**
 * @swagger
 * /diary/{diaryId}/comments:
 *  parameters:
 *  - name: diaryId
 *    in: path
 *    required: true
 *    description: 운동기록 id
 *    schema:
 *      type: string 
 * 
 *  post: 
 *      tags: [diary]
 *      summary: 해당 운동기록에 댓글 추가하기
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
 * 
 */
router.route('/:diaryId/comments')
    .post(isLoggedIn, catchAsync(diaries.createDiaryComment))

/**
 * @swagger
 * /diary/{diaryId}/comments/{commentId}:
 *  
 * 
 *  delete:
 *      tags: [diary]
 *      summary: 해당 운동기록에 해당 댓글 삭제하기
 */
router.route('/:diaryId/comments/:commentId')
    .delete(isLoggedIn, catchAsync(diaries.deleteDiaryComment))


module.exports = router;
