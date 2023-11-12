const mongoose = require('mongoose');
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
    text: String,
    uploadtime: {
        type: Date,
        dafault: Date.now,
        index: 1
    }
});

module.exports = mongoose.model('DiaryComment', DiaryCommentSchema);