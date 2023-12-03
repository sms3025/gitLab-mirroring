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
        return res.status(401).send("먼저 로그인을 하세요!");
    }
    next();
}

module.exports.isNotLoggedIn = async (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    }
    else{
        res.status(403).send('이미 로그인 되어있음.');
    }
}

module.exports.isCrewManger = async (req, res, next) => {
    const userId = req.user._id;
    const crewId = req.params.crewId;
    const crew = await Crew.findById(crewId);
    if (crew.manager._id !== userId) {
        return res.status(401).send("크루 매니저가 아닙니다.")
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
        return res.status(404).send("크루 멤버가 아닙니다.");
    }
    next();
}

module.exports.isDiaryAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const diaryId = req.params.diaryId;
    const diary = await Diary.findById({ _id: diaryId });
    if (!diary) {
        return res.status(404).send("유효하지 않은 기록입니다.");
    }
    if (userId !== diary.author._id) {
        return res.status(401).send("기록 당사자가 아닙니다.");
    }
    next();
}

module.exports.isNotionAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const notionId = req.params.notionId;
    const notion = await Notion.findById({ _id: notionId });
    if (!notion) {
        return res.status(404).send("유효하지 않은 기록입니다.");
    }
    if (userId !== notion.author._id) {
        return res.status(401).send("기록 당사자가 아닙니다.");
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
        return res.status(401).send("Invalid diaryId or you are not diaryComment Author");
    }
    next();
}

module.exports.isNotionCommentAuthor = async (req, res, next) => {
    const userId = req.user._id;
    const { notionId, commentId } = req.params;
    const notionComment = await NotionComment.findById({ _id: commentId });
    if (!notionComment) {
        return res.status(404).send("Invalid notionCommentId");
    }
    if (notionComment.post._id !== notionId || notionComment.author._id !== userId) {
        return res.status(401).send("Invalid notionId or you are not notionComment Author");
    }
    next();
}