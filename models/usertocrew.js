const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Crew = require('./crew');

const CrewSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crewid: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },

});

module.exports = mongoose.model('Crew', CrewSchema);