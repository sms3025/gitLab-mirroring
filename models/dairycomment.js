const mongoose = require('mongoose');
const Diary = require('./diary');
const User = require('./user');
const Schema = mongoose.Schema;

const DiaryCommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Diary'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String
});

module.exports = mongoose.model('DiaryComment', DiaryCommentSchema);