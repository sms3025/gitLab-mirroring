const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { showHomepage, getDiaryByDate, initHomepage } = require('../controllers/homepage');

/**
 * @swagger
 * /homepage:
 *  get:
 *      tags: [homepage]
 *      summary: 홈 화면 보여주기
 *      
 *      requestBody:
 *          content: 
 *               application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          month:
 *                              type: number
 *                              description: 원하는 month 정보
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
 *                                      $ref: '#/components/schemas/Crew'
 *                              records:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Diary'
 *                                  description: 1일부터 31일까지 배열에 인덱싱 되어있음
 */                         

router.route('/')
    .get(catchAsync(showHomepage))

router.route('/:day')
    .get(catchAsync(getDiaryByDate))

module.exports = router;