const Diary = require('../models/diary');
const DiaryComment = require('../models/diarycomment');
const User = require('../models/user');
const Crew = require('../models/crew');
const Notion = require('../models/notion');
const NotionComment = require('../models/notioncomment');
const ExpressError = require('../utils/ExpressError');
const { deleteImage } = require('../aws/index');


module.exports.createCrew = async (req, res) => {
    //crew 생성요청 처리
    const userId = req.user._id;
    const { crewname, exercise, cycle, description } = req.body;

    const foundUser = await User.findById(userId);


    const crew = new Crew({
        crewname: crewname,
        exercise: exercise,
        cycle: cycle,
        description: description,
        manager: userId,
        users: [userId]
    });
    crew.image = { filename: req.file.key, url: req.file.location };
    foundUser.crews.push(crew);
    await crew.save();
    await foundUser.save();

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
    // 크루 이미지, 올린 운동기록, 올린 왁자지껄 각 댓글들
    const crewId = req.params.id;
    const foundCrew = await Crew.findById(crewId);

    await User.updateMany({}, { $pullAll: { crews: [crewId] } });

    const foundNotion = await Notion.find({ crew: crewId });
    foundNotion.forEach(async notion => {
        if (notion.image) {
            deleteImage(notion.image.filename);
        }
        if (notion.comments.length !== 0) {
            await NotionComment.deleteMany({ post: notion._id });
        }
    })
    await Notion.deleteMany({ crew: crewId });

    const foundDiary = await Diary.find({ crew: crewId });
    foundDiary.forEach(async diary => {
        if (diary.image) {
            deleteImage(diary.image.filename);
        }
        if (diary.comments.legth !== 0) {
            await DiaryComment.deleteMany({ post: diary._id });
        }
    })
    await Diary.deleteMany({ crew: crewId });

    const filename = foundCrew.image.filename;
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

module.exports.deleteCrewMember = async (req, res) => {
    // 나가는 멤버가 작성한 운동기록, 게시글, 댓글 삭제, 사용자의 크루 목록에서 크루 삭제, 크루 유저에서 해당 유저 삭제 
    const userId = req.user._id;
    const crewId = req.params.crewId;

    await Crew.findByIdAndUpdate(crewId, { $pullAll: { users: [userId] } });
    await User.findByIdAndUpdate(userId, { $pullAll: { crews: [crewId] } });

    const foundNotion = await Notion.find({ author: userId, crew: crewId });

    foundNotion.forEach(async notion => {
        if (notion.image) {
            deleteImage(notion.image.filename);
        }
        if (notion.comments.length !== 0) {
            await NotionComment.deleteMany({ post: notion._id });
            await Notion.deleteOne({ _id: notion._id });
        }
    })

    const foundDiary = await Diary.find({ author: userId, crew: crewId });

    foundDiary.forEach(async diary => {
        if (diary.image) {
            deleteImage(diary.image.filename);
        }
        if (diary.comments.legth !== 0) {
            await DiaryComment.deleteMany({ post: diary._id });
            await Diary.deleteOne({ _id: diary._id });
        }
    })


    res.status(200).json('success');

}
