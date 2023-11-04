const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const ExploreSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crew: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    title: String,
    text: String,
    crewimage: [ImageSchema],
    uploadtime: {
        type: Date,
        index: -1
    }
});

module.exports = mongoose.model('Explore', ExploreSchema);