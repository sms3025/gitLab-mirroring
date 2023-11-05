const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const UserSchema = new Schema({
    loginid: {
        type: String,
        required: true,
        unique: true
    },
    nickname: String,
    image: [ImageSchema],
    goal: [{ text: String }],
    crews: [{
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    }]

});

UserSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('User', UserSchema);