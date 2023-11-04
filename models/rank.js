const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RankSchema = new Schema({
    crew: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
    ranking: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            count: Number,
        }
    ]
});

module.exports = mongoose.model('Rank', RankSchema);