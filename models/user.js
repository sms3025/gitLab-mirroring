const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const UserSchema = new Schema({
    name: String,
    passwd: String,
    nickname: String,
    image: [ImageSchema],
    goal: [{ text: String }]
});

module.exports = mongoose.model('User', UserSchema);