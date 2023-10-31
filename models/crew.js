const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CrewSchema = new Schema({
    crewid: String,
    crewname: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crewimage: [ImageSchema]
});

module.exports = mongoose.model('Crew', CrewSchema);