const ExpressError = require('../utils/ExpressError');
const Diary = require('../models/diary')
const DiaryComment = require('../models/diarycomment');
const User = require('../models/user');
const Crew = require('../models/crew');
const { deleteImage } = require('../aws/index');

module.exports.newDiaryForm = async (req, res) => {
    // render new diary form
    const userId = req.user._id
    const user = await User.findById({ _id: userId }).populate('crews')
    if (!user) {
        throw ExpressError("there is no user", 404);
    }
    const crews = { crews: user.crews }

    res.status(200).send(crews)
}

module.exports.createDiary = async (req, res) => {
    //create new diary
    const userId = req.user._id;
    const { crewId, type, time, memo } = req.body;
    const offset = 1000 * 60 * 60 * 9
    const krDate = new Date((new Date()).getTime() + offset)
    const diary = new Diary({
        author: userId,
        crew: crewId,
        image: { filename: req.file.key, url: req.file.location },
        type: type,
        time: time,
        memo: memo,
        uploadtime: krDate
    });
    
    const foundCrew = await Crew.findById(crewId);
    foundCrew.users.forEach(obj => {
        if (obj.user._id == userId) {
            obj.count += 1;
        }
    })

    await foundCrew.save()
    await diary.save();

    res.status(200).json('success!');
}

module.exports.deleteDiary = async (req, res) => {
    const diaryId = req.params.id;
    const foundDiary = await Diary.findById(diaryId);
    const filename = foundDiary.image.filename;
    // console.log(diaryId, diary);
    deleteImage(filename);
    const deleteComments = [];
    if (foundDiary.comments) {
        foundDiary.comments.forEach(id => {
            deleteTodoList.push(id);
        })
    }
    deleteComments.forEach(async id => {
        const result = await DiaryComment.deleteOne({ _id: id });
        if (!result) {
            throw new ExpressError('no diary comments', 400);
        }
    })

    await Diary.findByIdAndDelete(diaryId);

    res.status(200).json('success');
}

module.exports.createDiaryComment = async (req, res) => {
    const diaryId = req.params.diaryId;
    const foundDiary = await Diary.findById(diaryId);
    const userId = req.user._id;
    const offset = 1000 * 60 * 60 * 9
    const krDate = new Date((new Date()).getTime() + offset)
    const newComment = new DiaryComment({
        post: diaryId,
        author: userId,
        text: req.body.text,
        uploadtime: krDate,
    });
    foundDiary.comments.push(newComment);
    await foundDiary.save();
    await newComment.save();

    res.status(200).json('success');
}

module.exports.deleteDiaryComment = async (req, res) => {
    const diaryId = req.params.diaryId;
    const commentId = req.params.commentId;

    await DiaryComment.findByIdAndDelete(commentId);

    await Diary.updateMany({ _id: diaryId }, { $pullAll: { comments: [commentId] } });

    res.status(200).json('success');
}

module.exports.showDiary = async (req, res) => {
    const diaryId = req.params.diaryId;

    const foundDiary = await Diary.findById(diaryId)
        .populate('author')
        .populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        });
    res.status(200).send(foundDiary);
}
