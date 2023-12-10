const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const explores = require('../controllers/explores')


/**
 * @swagger
 * /explore:
 *  get:
 *      tags: [explore]
 *      summary: 모든 크루 목록 보여주기
 * 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Crew'
 *              
 */
router.route('/')
    .get(catchAsync(explores.showExplores));

module.exports = router;