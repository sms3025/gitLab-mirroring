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
    name: {
        type: String,
        required: true,
    },
    loginid: {
        type: String,
        required: true,
        unique: true
    },
    //password: String,
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    image: [ImageSchema],
    goal: [{ text: String }],
    crews: [{
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    }]

});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'loginid'
});



module.exports = mongoose.model('User', UserSchema);