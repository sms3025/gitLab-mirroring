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

const ExploreSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crewid: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    title: String,
    text: String,
    crewimage: [ImageSchema]
});

module.exports = mongoose.model('Explore', ExploreSchema);