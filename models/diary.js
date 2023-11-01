const mongoose = require('mongoose');
const User = require('./user');
const Crew = require('./crew');
const DiaryComment = require('./dairycomment');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const DiarySchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crewid: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    crewimage: [ImageSchema],
    type: String,
    startdate: String,
    time: Number,
    memo: String,
    like: Number,
});

module.exports = mongoose.model('Diary', DiarySchema);