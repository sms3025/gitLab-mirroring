const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String
});

module.exports = mongoose.model('Goal', GoalSchema);