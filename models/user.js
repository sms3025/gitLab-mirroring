const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


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
    image: {
        url: String,
        filename: String
    },
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