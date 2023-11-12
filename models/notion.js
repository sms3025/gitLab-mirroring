const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NotionSchema = new Schema({
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
    text: String,
    like: {
        type: Number,
        defaule: 0,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Notioncomment'
    }],
    uploadtime: {
        type: Date,
        default: Date.now,
        index: -1
    }

});

module.exports = mongoose.model('Notion', NotionSchema);