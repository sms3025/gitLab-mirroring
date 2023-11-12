const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const Diary = require('../models/diary');
const User = require('../models/user');
const Crew = require('../models/crew');
const Notion = require('../models/notion');
const Rank = require('../models/rank');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

router.route('/')
    .post(isLoggedIn, catchAsync(async (req, res) => {
        //crew 생성요청 처리
        const userId = req.body._id;
        const { crewname, exercise, cycle, description } = req.body;


        const crew = new Crew({
            crewname: crewname,
            exercise: exercise,
            cycle: cycle,
            description: description,
            manager: userId,
            users: [userId]
        });
        await crew.save();

        res.status(201);
    }))

router.route('/new')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        res.status(200).send("newPage!");
    }))

router.route('/:id')
    .get(catchAsync(async (req, res) => {
        //crew 들어온 후 홈화면

        // Diary db에서 운동기록
        const crewId = req.params.id;
        const crew = await Crew.findById(crewId)
            .populate('users')
            .populate('author')
        if (!crew) {
            throw new ExpressError("there is no crew", 400);
        }
        const diaries = await Diary.find({ crew: crewId })
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
            .sort({ 'uploadtime': -1 });
        if (!diaries) {
            throw new ExpressError("there is no diary", 400);
        }
        // notion db에서 게시글
        const notions = await Notion.find({ crew: crewId })
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
            .sort({ 'uploadtime': -1 });
        if (!notions) {
            throw new ExpressError("there is no notion", 400);
        }
        // User db에서 운동기록 (날짜기준은 한달)
        // const now = new Date();
        // const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        // const users = crew.users;
        // const userRecord = [];
        // users.forEach(async (user) => {
        //     const userDiaries = await Diary.find({author:user._id, uploadtime:{$gte:oneMonthAgo}});
        //     const userCount = userDiaries.length;
        //     const userObject = {
        //         name: user.name,
        //         count: userCount
        //     }
        //     userRecord.push(userObject);
        // })

        //sort?

        const rank = Rank.find({ crew: crewId })
            .populate('ranking.user')
            .sort({ 'ranking.count': -1 });
        const ranks = rank.ranking;


        const result = {
            diaries: diaries,
            notions: notions,
            ranks: ranks,
        }
        res.status(200).send(result);
    }))



router.route('/:id/diary/:diaryId/comments')
    .post()
    .delete()

router.route('/:id/notion/:notionId/comments')
    .post()
    .delete()

router.route('/:id/user/')
    .post(catchAsync(async (req, res) => {

    }))

module.exports = router;