const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const crews = require('../controllers/crews')
const { isLoggedIn } = require('../middleware');
const { upload } = require('../aws/index');

/**
 * @swagger
 * /crew:
 *  post:
 *      tags: [crew]
 *      summary: 새 크루 만들기
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          crewname:
 *                              type: string
 *                              description: 크루 이름
 *                          exercise:
 *                              type: string
 *                              description: 크루 운동
 *                          cycle:
 *                              type: string
 *                              description: 크루 운동 주기
 *                          description:
 *                              type: string
 *                              description: 크루 소개
 *                          image:
 *                              type: binary
 *                 
 *      responses:
 *          "200": 
 *              description: OK                  
 */
router.route('/')
    .post(isLoggedIn, upload.single('filename'), catchAsync(crews.createCrew))

/**
 * @swagger
 * /crew/new:
 *  get:
 *      tags:
 *      - crew
 *      description:
 *      - application/json
 *      
 *          
 *          
 *              
 *
 */
router.route('/new')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        res.status(200).send("newPage!");
    }))

/**
 * @swagger
 * /crew/{crewId}:
 *  parameters:
 *  - name: crewId
 *    in: path
 *    required: true
 *    description: 크루 id
 *    schema:
 *      type: string 
 *  get:
 *      tags: [crew]
 *
 *      summary: showcrew
 *      description: showCrew
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
 *                              diary:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Diary'
 *                              notion:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Notion'
 *                                      
 *                                      
 * 
 * 
 */
router.route('/:crewId')
    .get(catchAsync(crews.showCrew))
    .delete(catchAsync(crews.deleteCrew))



/**
 * @swagger
 * /crew/{crewId}/user:
 *  parameters:
 *  - name: crewId
 *    in: path
 *    required: true
 *    description: 크루 id
 *    schema:
 *      type: string 
 *  post:
 *      tags: [crew]
 *      summary: 해당 크루에 사용자 추가하기
 *
 *      
 *      responses:
 *          '200':
 *              description: OK
 * 
 *  delete:
 *      tags: [crew]
 *      summary: 해당 크루에서 해당 사용자 삭제하기
 */
router.route('/:crewId/user/')
    .post(catchAsync(crews.addNewMember))
    .delete(catchAsync(crews.deleteCrewMember))

module.exports = router;
