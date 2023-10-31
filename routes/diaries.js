const express = require('express');
const router = express.Router();

router.route('/')
    .post((req, res) => {
        //create new diary
    })

router.route('/new')
    .get((req, res) => {
        // render new diary form
    })

router.route('/:crewId')
    .get((req, res) => {
        // send diary information of crewId
    })

module.exports = router;