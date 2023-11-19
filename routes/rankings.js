const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const ranking = require('../controllers/ranking')

/**
 * @swagger
 * /crew/{crewId}/ranking:
 *  parameters:
 *  - name: crewId
 *    in: path
 *    required: true
 *    description: 크루 id
 *    schema:
 *      type: number 
 * 
 *  get:
 *      tags: [ranking]
 *      summary: 해당 크루의 랭킹보기
 * 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *                      description: 사용자를 운동횟수와 이름 순으로 정렬하였음.
 *              
 */
router.route('/')
    .get(catchAsync(ranking.showRanking));

module.exports = router;