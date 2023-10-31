const express = require('express');
const router = express.Router();

router.route('/')
    .post((req, res) => {
        //crew 생성요청 처리
    })

router.route('/new')
    .get((req, res) => {
        //crew 생성 페이지
    })

router.route('/:id')
    .get((req, res) => {
        //crew 들어온 후 홈화면
    })




module.exports = router;