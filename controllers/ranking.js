const Crew = require('../models/crew');
const Diary = require('../models/diary');

const ExpressError = require('../utils/ExpressError');

module.exports.showRanking = async (req, res) => {
    const crewId = req.params.crewId;
    console.log("crewId, rnk", crewId)
    const foundCrew = Crew.findById(crewId)
        .populate('users.user')
        .sort({ 'users.count': -1, 'users.user.nickname': 1 });
    console.log("showRanking",foundCrew)
    const ranking = foundCrew.users;
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
