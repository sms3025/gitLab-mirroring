const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CrewSchema = new Schema({
    crewname: String,
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: [ImageSchema],
    exercise: String,
    cycle: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User', 
    }],
    description: String
});

module.exports = mongoose.model('Crew', CrewSchema);