const Crew = require('../models/crew');
const Diary = require('../models/diary');

const ExpressError = require('../utils/ExpressError');

module.exports.showRanking = async (req, res) => {
    const crewId = req.params.id;
    const foundCrew = Crew.findById(crewId)
        .populate('users.user')
        .sort({ 'users.count': -1, 'users.user.nickname': 1 });
    const ranking = foundCrew.users;
    
    res.status(200).send(ranking);
}

module.exports.updateRanking = async () => {
    const allCrews = await Crew.find({});
    allCrews.forEach(crew => {
        crew.users.forEach(user => {
            user.count = 0;
        })
    })

}
