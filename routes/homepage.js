const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { showHomepage, getDiaryByDate, initHomepage } = require('../controllers/homepage');

/**
 * @swagger
 * /homepage:
 *  get:
 *      tags: [homepage]
 *      summary: 홈 화면 보여주기(initHomepage)
 *      
 * 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              crews:
 *                                  type: array
 *                                  items:
 *                                      crew:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  description: 크루 id
 *                                              name:
 *                                                  type: string
 *                                                  description: 크루 이름
 *                                              image:
 *                                                  type: object
 *                                                  properties:
 *                                                      url:
 *                                                          type: string
 *                                                          description: 이미지 저장 위치
 *                                                      filename:
 *                                                          type: string
 *                                                          description: 이미지 파일 이름
 *                                                  description: 크루 이미지
 *                                              exercise:
 *                                                  type: string
 *                                                  description: 크루 운동
 *                                              cycle:
 *                                                  type: string,
 *                                                  description: 크루 운동 주기
 *                                              description:
 *                                                  type: string,
 *                                                  description: 크루 메모
 *                              records:
 *                                  type: array
 *                                  items:
 *                                      diary:
 *                                          description: 0 또는 1
 *                                  description: 1일부터 31일까지 배열에 인덱싱 되어있음
 */

router.route('/')
    .get(catchAsync(initHomepage))


/**
 * @swagger
 * /homepage/{day}:
 *  parameters:
 *  - name: day
 *    in: path
 *    required: true
 *    description: 원하는 날짜
 *  get:
 * 
 *      tags: [homepage]
 *      summary: 특정 날짜의 운동기록 
 *      
 * 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              
 *                              records:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                          description: 운동기록 아이디
 *                                      type:
 *                                          type: string
 *                                          description: 운동 종류
 *                                      time:
 *                                          type: number
 *                                          description: 운동한 시간()
 *                                      memo:
 *                                          type: string
 *                                          description: 운동 메모
 *                                      uploadtime:
 *                                          type: string
 *                                          description: 운동기록 올린 날짜(Date 타입)
 *                                  description: 원하는 날짜의 운동기록이 저장되어있음.
 */
router.route('/:day')
    .get(catchAsync(getDiaryByDate))

module.exports = router;
