const User = require('./models/user');
const Crew = require('./models/crew');
const Diary = require('./models/diary');
const DiaryComment = require('./models/diarycomment');
const Notion = require('./models/notion');
const NotionComment = require('./models/notioncomment');
const catchAsync = require('./utils/catchAsync');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.status(400).send("You have to login before access");
    }
    next();
}

module.exports.isCrewManger = async (req, res, next) => {
    const userId = req.user._id;
    const crewId = req.params.crewId;
    const crew = await Crew.findById(crewId);
    if (crew.manager._id !== userId) {
        return res.status(400).send("You are not crew manager")
    }
    next();
}

module.exports.isCrewMember = async (req, res, next) => {
    const userId = req.user._id;
    const crewId = req.params.crewId;
    const user = await Crew.find(
        { _id: crewId },
        { users: { $elemMatch: { _id: userId } } }
    );
    if (!user) {
        return res.status(400).send("You are not crew member");
    }
    next();
}

module.exports.isDiaryAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const diaryId = req.params.diaryId;
    const diary = await Diary.findById({ _id: diaryId });
    if (!diary) {
        return res.status(400).send("Invalid dariyId");
    }
    if (userId !== diary.author._id) {
        return res.status(400).send("You are not diary author");
    }
    next();
}

module.exports.isNotionAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const notionId = req.params.notionId;
    const notion = await Notion.findById({ _id: notionId });
    if (!notion) {
        return res.status(400).send("Invalid notionId");
    }
    if (userId !== notion.author._id) {
        return res.status(400).send("You are not notion author");
    }
    next();
}

module.exports.isDiaryCommentAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const { diaryId, commentId } = req.params;
    const diaryComment = await DiaryComment.findById({ _id: commentId });
    if (!diaryComment) {
        return res.status(404).send("Invalid diaryCommentId");
    }
    if (diaryComment.post._id !== diaryId || diaryComment.author._id !== userId) {
        return res.status(400).send("Invalid diaryId or you are not diaryComment Author");
    }
    next();
}

module.exports.isNotionCommentAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const { notionId, commentId } = req.params;
    const notionComment = await NotionComment.findById({ _id: commentId });
    if (!notionComment) {
        return res.status(404).send("Invalid diaryCommentId");
    }
    if (notionComment.post._id !== notionId || notionComment.author._id !== userId) {
        return res.status(400).send("Invalid diaryId or you are not diaryComment Author");
    }
    next();
}