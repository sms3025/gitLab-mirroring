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

const NotionSchema = new Schema({
    notionid: String,
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crewid: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    crewimage: [ImageSchema],
    text: String,
    like: Number
});

module.exports = mongoose.model('Notion', NotionSchema);