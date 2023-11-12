const Diary = require('../models/diary');
const User = require('../models/user');
const Crew = require('../models/crew');
const Notion = require('../models/notion');
const ExpressError = require('../utils/ExpressError');
const { deleteImage } = require('../aws/index');

module.exports.createCrew = async (req, res) => {
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
    crew.image = { filename: req.file.key, url: req.file.location }
    await crew.save();

    res.status(201).json('success');
}

module.exports.showCrew = async (req, res) => {
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
    
    const result = {
        diaries: diaries,
        notions: notions
    }
    res.status(200).send(result);
}

module.exports.deleteCrew = async (req, res) => {
    const crewId = req.params.id;
    const crew = await Crew.findById(crewId);
    await User.updateMany({}, { $pullAll: { crews: [crewId] } });

    const filename = crew.image.filename;
    deleteImage(filename);

    await Crew.findByIdAndDelete(crewId);

    res.status(200).json('success');
}

module.exports.addNewMember = async (req, res) => {
    // 크루에 새로운 유저 등록
    const userId = req.user._id;
    const crewId = req.params.id;
    const foundCrew = await Crew.findById(crewId);
    foundCrew.users.push(userId);

    const foundUser = await User.findById(userId);
    foundUser.crews.push(crewId);

    await foundCrew.save();
    await foundUser.save();

    res.status(200).json('success');
}