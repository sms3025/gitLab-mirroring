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
 *                  
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
 */
router.route('/new')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        res.status(200).send("newPage!");
    }))

/**
 * @swagger
 * /crew/:crewId:
 *  get:
 *      tags: [crew]
 *      
 *      summary: showcrew
 *      description: showCrew
 * 
 * delete:
 *      tags: [crew]
 *      summary: delete Crew
 *      description: 해당 크루 삭제
 */
router.route('/:crewId')
    .get(catchAsync(crews.showCrew))
    .delete(catchAsync(crews.deleteCrew))

/**
 * @swagger
 * /crew/:crewId/diary:
 *  get:
 *      tags: [crew]
 *      summary: 해당 크루에 운동기록 보여주기
 */
router.route('/:crewId/diary')
    .get(catchAsync())


/**
 * @swagger
 * /crew/:crewId/user:
 *  post:
 *      tags: [crew]
 *      summary: 해당 크루에 사용자 추가하기
 * 
 *  delete:
 *      tags: [crew]
 *      summary: 해당 크루에서 해당 사용자 삭제하기
 */
router.route('/:crewId/user/')
    .post(catchAsync(crews.addNewMember))
    .delete(catchAsync(crews.deleteCrewMember))

module.exports = router;