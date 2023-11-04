const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const NotionSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crew: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    image: [ImageSchema],
    text: String,
    like: Number,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Notioncomment'
    }],
    uploadtime: {
        type: Date,
        index: -1
    }

});

module.exports = mongoose.model('Notion', NotionSchema);