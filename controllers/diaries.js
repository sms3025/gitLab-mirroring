const ExpressError = require('../utils/ExpressError');
const Diary = require('../models/diary')
const DiaryComment = require('../models/diarycomment');
const User = require('../models/user');
const Crew = require('../models/crew');
const { deleteImage } = require('../aws/index');

module.exports.newDiaryForm = async (req, res) => {
    const userId = req.user._id
    const user = await User.findById({ _id: userId }).populate('crews')
    if (!user) {
        throw ExpressError("there is no user", 404);
    }
    const crews = { crews: user.crews }

    res.status(200).send(crews)
}

module.exports.createDiary = async (req, res) => {
    console.log("0")
    const userId = req.user._id;
    console.log("1")
    const { crewId, type, time, memo } = req.body;
    console.log(crewId);
    const uploadTime = new Date();
    const diary = new Diary({
        author: userId,
        crew: crewId,
        image: { filename: req.file.key, url: req.file.location },
        type: type,
        time: time,
        memo: memo,
        uploadtime: uploadTime,
    });
    console.log("2")
    const foundCrew = await Crew.findById(crewId);
    console.log("3");
    foundCrew.users.forEach(obj => {
        if (obj.user.toString() === userId.toString()) {
            obj.count += 1;
        }
    })
   
    await foundCrew.save()
    console.log("4");
    await diary.save();
    console.log("5")
    res.status(200).json('success!');
}

module.exports.deleteDiary = async (req, res) => {
    const diaryId = req.params.id;
    const foundDiary = await Diary.findById(diaryId);
    const filename = foundDiary.image.filename;
    
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
    const uploadTime = new Date();
    const newComment = new DiaryComment({
        post: diaryId,
        author: userId,
        text: req.body.text,
        uploadtime: uploadTime
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
