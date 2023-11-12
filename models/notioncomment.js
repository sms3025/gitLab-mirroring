const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const NotionCommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Notion'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    uploadtime: {
        type: Date,
        default: Date.now,
        index: 1
    }
});

module.exports = mongoose.model('NotionComment', NotionCommentSchema);