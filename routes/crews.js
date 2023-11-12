const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const crews = require('../controllers/crews')
const { isLoggedIn } = require('../middleware');
const { upload} = require('../aws/index');
router.route('/')
    .post(isLoggedIn, upload.single('filename'), catchAsync(crews.createCrew))

router.route('/new')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        res.status(200).send("newPage!");
    }))

router.route('/:crewId')
    .get(catchAsync(crews.showCrew))
    .delete(catchAsync(crews.deleteCrew))


router.route('/:crewId/diary')
    .get(catchAsync())



router.route('/:crewId/user/')
    .post(catchAsync(crews.addNewMember))

module.exports = router;