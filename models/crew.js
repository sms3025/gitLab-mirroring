const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const CrewSchema = new Schema({
    crewname: {
        type: String,
        required: true
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    exercise: String,
    cycle: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    description: String
});

module.exports = mongoose.model('Crew', CrewSchema);