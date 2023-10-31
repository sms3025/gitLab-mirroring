const mongoose = require('mongoose');
const User = require('./user');
const Crew = require('./crew');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const NotionCommentSchma = new Schema({
    notionid: String,
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
});

module.exports = mongoose.model('NotionComment', NotionCommentSchma);