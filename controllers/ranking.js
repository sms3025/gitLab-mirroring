const Crew = require('../models/crew');
const Diary = require('../models/diary');

const ExpressError = require('../utils/ExpressError');

module.exports.showRanking = async (req, res) => {
    const crewId = req.params.crewId;

    const foundCrew = await Crew.findById(crewId)
        .populate('users.user')

    const foundUser = foundCrew.users.slice();
    const ranking = foundUser.sort((a, b) => {
        // return b.count - a.count;
        if (a.count === b.count) {
            return a.user.nickname - b.user.nickname;
        }
        return b.count - a.count;
    });

    const result = {
        ranking: ranking
    }
    res.status(200).send(result);
}

module.exports.updateRanking = async () => {
    const allCrews = await Crew.find({});
    allCrews.forEach(crew => {
        crew.users.forEach(user => {
            user.count = 0;
        })
    })

}
