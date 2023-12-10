const Notion = require('../models/notion');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');
const { deleteImage } = require('../aws/index');
const NotionComment = require('../models/notioncomment')

module.exports.createNotion = async (req, res) => {
    const crewId = req.params.crewId;
    const userId = req.user._id;
    
    const newNotion = new Notion({
        author: userId,
        crew: crewId,
        image: { url: req.file.location, filename: req.file.key },
        text: req.body.text,
        
    });

    await newNotion.save();

    res.status(200).json('success');
}

module.exports.deleteNotion = async (req, res) => {
    const notionId = req.params.notionId;
    const foundNotion = await Notion.findById(notionId);
    const filename = foundNotion.image.key;

    deleteImage(filename);

    const deleteComments = [];
    if (foundNotion.comments) {
        foundNotion.comments.forEach(id => {
            deleteTodoList.push(id);
        })
    }
    deleteComments.forEach(async id => {
        const result = await NotionComment.deleteOne({ _id: id });
        if (!result) {
            throw new Error('해당 id의 todo list가 없습니다.')
        }
    })

    await Notion.findByIdAndDelete(notionId);

    res.status(200).json('success');
}

module.exports.createNotionComment = async (req, res) => {
    const userId = req.user._id;
    const { notionId } = req.params;
    const foundNotion = await Notion.findById(notionId);
  
    const newComment = new NotionComment({
        author: userId,
        post: notionId,
        text: req.body.text,
        
    })
    foundNotion.comments.push(newComment);
    await foundNotion.save();
    await newComment.save();

    res.status(200).json('success');
}

module.exports.deleteNotionComment = async (req, res) => {
    const { notionId, commentId } = req.params;
    await NotionComment.findByIdAndDelete(commentId);

    await Notion.updateMany({ _id: notionId }, { $pullAll: { comments: [commentId] } });

    res.status(200).json('success');
}

module.exports.showNotion = async (req, res) => {
    const { notionId } = req.params;

    const foundNotion = await Notion.findById(notionId)
        .populate('author')
        .populate({
            path: 'comments',
            populate: 'author'
        })

    res.status(200).send(foundNotion);
}
