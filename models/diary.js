const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const DiarySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crew: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    image: {
        url: String,
        filename: String
    },
    type: String,
    time: Number,
    memo: String,
    like: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'DiaryComment'
    }],
    uploadtime: {
        type: Date,
        default: Date.now,
        index: -1
    }
});

module.exports = mongoose.model('Diary', DiarySchema);